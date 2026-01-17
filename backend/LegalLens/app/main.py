from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import tempfile

from app.parser import extract_text_from_pdf
from app.clause_detector import classify_clause
from app.risk_engine import (
    calculate_risk,
    detect_missing_clauses,
    overall_risk_score
)
from app.models import ClauseResult, ContractResponse

app = FastAPI(title="LegalLens")

# CORS (safe for local development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/analyze-contract", response_model=ContractResponse)
async def analyze_contract(file: UploadFile = File(...)):
    fd, temp_path = tempfile.mkstemp(suffix=".pdf")

    try:
        with os.fdopen(fd, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(temp_path)

        clauses = []
        paragraphs = text.split("\n\n")

        for para in paragraphs:
            para = para.strip()
            if len(para) < 50:
                continue

            clause_type = classify_clause(para)
            risk = calculate_risk(clause_type, para)

            clauses.append(
                ClauseResult(
                    clause_type=clause_type,
                    risk_score=risk["risk_score"],
                    reasons=risk["reasons"],
                    text=para
                )
            )

        # ✅ NEW: missing clause detection
        missing_clauses = detect_missing_clauses(text)

        # ✅ NEW: overall contract risk
        overall_risk = overall_risk_score(clauses)

        return ContractResponse(
            clauses=clauses,
            missing_clauses=missing_clauses,
            overall_risk=overall_risk
        )

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
