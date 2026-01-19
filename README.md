⚖️ LegalLens – AI-Powered Legal Risk Analysis Platform

LegalLens is a full-stack AI web application that analyzes legal contracts and documents to identify risk levels, missing clauses, and potential issues using modern NLP techniques.

The system is built with a FastAPI backend and a Next.js frontend, designed for scalability, real-world deployment, and resume-grade engineering quality.

🚀 Features

📄 PDF Contract Upload

🧠 AI-based Clause Risk Analysis

⚠️ Missing Critical Clause Detection

📊 Risk Distribution (High / Medium / Low)

🧾 Executive Risk Summary

📥 Downloadable AI Risk Report (PDF)

⚡ Fast, clean, production-ready UI

🏗️ Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Client-side PDF generation (jsPDF)

Backend

FastAPI

Python

Pydantic

Uvicorn

Transformer-based NLP models

Deployment

Frontend: Vercel

Backend: Hugging Face Spaces / Docker / FastAPI

Version Control: Git + GitHub

📂 Project Structure
LegalLens/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── components/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   └── schemas/
│   ├── requirements.txt
│   └── Dockerfile
│
└── README.md

🔌 API Endpoints
Health Check
GET /

Analyze Text
POST /analyze-text

Analyze PDF
POST /analyze-pdf


Response includes:

Overall risk score

Clause-level risk

Missing clauses

AI-generated explanations

▶️ Running Locally
Backend (FastAPI)
cd legal-ai-backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000

Frontend (Next.js)
cd legal-ai-frontend
npm install
npm run dev


Frontend runs at:

http://localhost:3000

🌍 Deployment
Frontend

Deployed using Vercel

Optimized for SSR + client-side execution

Backend

Deployed using Hugging Face Spaces (Docker)

Exposes FastAPI endpoints publicly


🔮 Future Improvements

Legal-specific transformer models

OCR for scanned contracts

Clause similarity search (embeddings)

User authentication

Multi-document comparison

Legal compliance explanations
