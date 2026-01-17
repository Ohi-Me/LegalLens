AI Legal Risk Simulator

An AI-powered web application that analyzes legal contracts (PDFs) and provides clause-level risk analysis, missing clause detection, and an overall contract risk score using NLP.

Built with FastAPI + Legal-BERT (NLP) + Next.js.

🚀 Features

📄 Upload legal contract PDFs

🧠 Clause detection using Legal-BERT embeddings

⚠️ Clause-level risk scoring with explanations

❗ Detection of missing critical clauses

📊 Overall contract risk score

🌐 Web-based UI (Next.js frontend)

🔌 REST API backend (FastAPI)

🏗️ Tech Stack
Backend

FastAPI

Python

Legal-BERT (nlpaueb/legal-bert-base-uncased)

PyTorch

pdfplumber

Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

📁 Project Structure
legal-ai-backend/
├── app/
│   ├── main.py
│   ├── parser.py
│   ├── clause_detector.py
│   ├── risk_engine.py
│   ├── models.py
│
├── requirements.txt
└── README.md

legal-ai-frontend/
├── app/
│   └── page.tsx
├── public/
├── package.json
└── README.md

⚙️ Backend Setup
1️⃣ Create virtual environment
python -m venv .venv

2️⃣ Activate virtual environment

Windows

.venv\Scripts\activate


Mac / Linux

source .venv/bin/activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run backend
python -m uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000


API docs:

http://127.0.0.1:8000/docs

🌐 Frontend Setup
cd legal-ai-frontend
npm install
npm run dev


Frontend runs at:

http://localhost:3000

📤 API Endpoint
POST /analyze-contract

Input

multipart/form-data

PDF file

Output (example)

{
  "overall_risk": 62,
  "missing_clauses": [
    "Indemnification",
    "Force Majeure"
  ],
  "clauses": [
    {
      "clause_type": "Termination",
      "risk_score": 60,
      "reasons": ["Termination without notice"],
      "text": "..."
    }
  ]
}

🧠 How Risk Is Calculated

Each clause starts with a base risk score

Keywords and legal patterns increase risk

Scores are capped at 100

Overall risk = average clause risk

Missing essential clauses increase exposure

📌 Supported Clause Types

Termination

Liability

Payment

Confidentiality

Governing Law

Indemnification

Force Majeure

Dispute Resolution

Jurisdiction

Intellectual Property

🧪 Example Contracts to Test

Service Agreements

NDA (Non-Disclosure Agreements)

Vendor Agreements

Consulting Contracts

Employment Agreements

📈 Future Enhancements

Clause rewrite suggestions

Jurisdiction conflict detection

Risk heatmap visualization

PDF report download

Authentication & user history

Fine-tuned clause classifier