def calculate_risk(clause_type: str, clause_text: str) -> dict:
    score = 20
    reasons = []

    text = clause_text.lower()

    if clause_type == "Termination":
        if "without notice" in text:
            score += 40
            reasons.append("Termination without notice")
        if "immediate termination" in text:
            score += 20
            reasons.append("Immediate termination rights")

    if clause_type == "Liability":
        if "unlimited" in text:
            score += 50
            reasons.append("Unlimited liability exposure")
        if "indirect damages" in text:
            score += 20
            reasons.append("Includes indirect or consequential damages")

    if clause_type == "Payment":
        if "delay" in text or "late" in text:
            score += 25
            reasons.append("Delayed payment terms")
        if "non-refundable" in text:
            score += 15
            reasons.append("Non-refundable payments")

    if clause_type == "Confidentiality":
        if "indefinite" in text or "perpetual" in text:
            score += 30
            reasons.append("Indefinite confidentiality obligation")

    if clause_type == "Indemnification":
        if "defend" in text and "hold harmless" in text:
            score += 30
            reasons.append("Broad indemnification obligation")

    if clause_type == "Governing Law":
        if "exclusive jurisdiction" in text:
            score += 15
            reasons.append("Exclusive jurisdiction requirement")

    score = min(score, 100)

    if not reasons:
        reasons.append("Standard industry clause")

    return {
        "risk_score": score,
        "reasons": reasons
    }


def explain_clause(clause_type: str) -> str:
    explanations = {
        "Termination": "Defines how and when the agreement can be ended.",
        "Liability": "Allocates financial responsibility between parties.",
        "Payment": "Specifies payment timing, method, and obligations.",
        "Confidentiality": "Protects sensitive or proprietary information.",
        "Governing Law": "Determines which laws govern the contract.",
        "Indemnification": "Shifts legal and financial risk to one party.",
        "Force Majeure": "Excuses performance due to uncontrollable events.",
        "Dispute Resolution": "Defines how disputes are resolved."
    }
    return explanations.get(clause_type, "Standard contractual clause.")


def safer_suggestion(clause_type: str):
    suggestions = {
        "Termination": "Require at least 30 days written notice before termination.",
        "Liability": "Cap liability to fees paid in the previous 12 months.",
        "Payment": "Require payment within 30 days of invoice.",
        "Confidentiality": "Limit confidentiality obligations to 3–5 years.",
        "Indemnification": "Limit indemnity to direct damages only.",
        "Governing Law": "Avoid exclusive foreign jurisdiction clauses."
    }
    return suggestions.get(clause_type)


def detect_missing_clauses(text: str):
    required_clauses = {
        "Limitation of Liability": "liability",
        "Dispute Resolution": "arbitration",
        "Force Majeure": "force majeure",
        "Indemnification": "indemnify",
        "Governing Law": "governing law"
    }

    missing = []
    lower_text = text.lower()

    for clause_name, keyword in required_clauses.items():
        if keyword not in lower_text:
            missing.append(clause_name)

    return missing


def overall_risk_score(clauses):
    if not clauses:
        return 0
    return min(
        100,
        sum(c.risk_score for c in clauses) // len(clauses)
    )
