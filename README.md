# LearnMate

<p align="center">
  <img src="assets/learnmate-banner.png" alt="LearnMate Banner" width="100%">
</p>

<p align="center">
  <strong>AI-Powered Adaptive Learning Platform</strong>
</p>

<p align="center">
  Personalized Learning • Intelligent Tutoring • Learning Analytics • RAG
</p>

<p align="center">
  <a href="https://learnmate-beta.vercel.app">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#installation">Installation</a>
</p>

---

## Live Demo

**Website:** https://learnmate-beta.vercel.app

Experience LearnMate directly through the deployed application.

<img width="1478" height="579" alt="image" src="https://github.com/user-attachments/assets/ec6db945-5986-40a4-ae2d-c90375093614" />


---

## About LearnMate

LearnMate is an intelligent adaptive learning platform that combines Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), learner analytics, and personalized curriculum planning to create a customized learning experience.

Unlike traditional AI assistants that simply answer questions, LearnMate tracks learner progress, identifies knowledge gaps, and adapts learning pathways to improve concept mastery and retention.

---

## Features

### AI Tutoring

* Context-aware explanations
* Step-by-step learning support
* Concept simplification
* Example-based teaching

### Adaptive Learning

* Personalized learning paths
* Dynamic topic progression
* Knowledge gap identification
* Revision recommendations

### Assessment System

* Quiz generation
* Flashcard generation
* Performance evaluation
* Progress tracking

### Learning Analytics

* Learning dashboard
* Accuracy tracking
* Study time analysis
* Performance insights

### Retrieval-Augmented Generation

* Context-aware responses
* Reduced hallucination
* Semantic document retrieval
* Knowledge-grounded explanations

---

## System Architecture

<p align="center">
  <img src="assets/architecture.png" width="900">
</p>

The LearnMate architecture consists of:

* User Interface Layer
* Input Processing Layer
* AI Learning Engine
* Learning Intelligence Core
* Data Layer
* Analytics Engine
* Output Layer

---

## Technology Stack

| Category     | Technologies                             |
| ------------ | ---------------------------------------- |
| Frontend     | Next.js, React, TypeScript, Tailwind CSS |
| Backend      | FastAPI, Python                          |
| AI Models    | OpenAI GPT, Llama, Sentence Transformers |
| RAG          | LangChain                                |
| Database     | Supabase (PostgreSQL)                    |
| Vector Store | FAISS, ChromaDB                          |
| Deployment   | Vercel, Docker                           |

---

## Project Structure

```bash
learnmate/
│
├── frontend/
├── backend/
├── data/
├── vector_db/
├── docs/
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/username/learnmate.git
cd learnmate
```

### Backend Setup

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Environment Variables

```env
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

### Run Frontend

```bash
npm install
npm run dev
```

---

## Adaptive Cognitive Learning Algorithm (ACLA)

LearnMate introduces ACLA, a personalized learning algorithm that:

1. Tracks learner performance
2. Computes mastery scores
3. Identifies weak concepts
4. Adapts learning paths
5. Generates targeted recommendations

---

## Testing Results

| Module               | Status |
| -------------------- | ------ |
| Authentication       | Passed |
| AI Tutoring          | Passed |
| RAG Pipeline         | Passed |
| Assessment Engine    | Passed |
| Learning Analytics   | Passed |
| Database Integration | Passed |

---

## Future Roadmap

* Emotion-aware learning
* Voice tutoring
* Knowledge graph integration
* Local LLM support
* Multi-language learning
* Predictive learning analytics

---

## Author

**Geetha K**
B.Tech Artificial Intelligence and Data Science
National Engineering College

---

## License

MIT License
