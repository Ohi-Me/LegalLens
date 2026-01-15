from pydantic import BaseModel
from typing import List, Optional

class ClauseResult(BaseModel):
    clause_type: str
    risk_score: int
    reasons: List[str]
    text: str

    # optional advanced fields (safe defaults)
    explanation: Optional[str] = None
    suggestion: Optional[str] = None
    impact_area: Optional[str] = None


class ContractResponse(BaseModel):
    # optional metadata (safe defaults)
    document_type: Optional[str] = None
    confidence: Optional[int] = None
    governing_law: Optional[str] = None
    jurisdiction_risk: Optional[str] = None

    # core outputs (actually returned)
    overall_risk: int
    missing_clauses: List[str]
    clauses: List[ClauseResult]

    # optional analytics
    top_risks: Optional[List[str]] = None
