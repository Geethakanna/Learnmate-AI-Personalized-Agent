import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { question, documentId } = await req.json();

    if (!question || !documentId) {
      return new Response(JSON.stringify({ error: "Missing question or documentId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch document chunks
    const { data: chunks, error: chunksError } = await supabase
      .from("document_chunks")
      .select("content, page_number, chunk_index")
      .eq("document_id", documentId)
      .eq("user_id", userId)
      .order("chunk_index");

    if (chunksError) {
      console.error("Chunks error:", chunksError);
      return new Response(JSON.stringify({ error: "Failed to fetch document" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!chunks || chunks.length === 0) {
      return new Response(JSON.stringify({ 
        answer: "No content found in this document.",
        citations: []
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Simple keyword-based retrieval (top-k most relevant chunks)
    const questionWords = question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    const scoredChunks = chunks.map((chunk: any) => {
      const content = chunk.content.toLowerCase();
      let score = 0;
      for (const word of questionWords) {
        if (content.includes(word)) score += 1;
      }
      return { ...chunk, score };
    });

    scoredChunks.sort((a: any, b: any) => b.score - a.score);
    const topChunks = scoredChunks.slice(0, 5);
    const context = topChunks.map((c: any) => c.content).join("\n\n---\n\n");

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful study assistant. Answer questions based ONLY on the provided document context. 
If the answer is not in the context, say "I couldn't find this information in your document."
Be concise and cite which parts of the document you're referencing.`,
          },
          {
            role: "user",
            content: `Context from the document:\n\n${context}\n\n---\n\nQuestion: ${question}`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const answer = aiData.choices?.[0]?.message?.content || "Unable to generate answer.";

    // Create citations from top chunks
    const citations = topChunks
      .filter((c: any) => c.score > 0)
      .slice(0, 3)
      .map((c: any) => ({
        page: c.page_number || 1,
        text: c.content.substring(0, 150) + "...",
      }));

    return new Response(JSON.stringify({ answer, citations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RAG query error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
