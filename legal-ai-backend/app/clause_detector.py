from transformers import AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained(
    "nlpaueb/legal-bert-base-uncased"
)
model = AutoModel.from_pretrained(
    "nlpaueb/legal-bert-base-uncased"
)

CLAUSE_TYPES = [
    "Termination",
    "Liability",
    "Payment",
    "Confidentiality",
    "Governing Law",
    "Indemnification",
    "Force Majeure",
    "Dispute Resolution",
    "Jurisdiction",
    "Intellectual Property"
]

def classify_clause(text: str) -> str:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    # embeddings generated (future fine-tuning ready)
    with torch.no_grad():
        _ = model(**inputs).last_hidden_state.mean(dim=1)

    t = text.lower()

    if "terminate" in t or "termination" in t:
        return "Termination"

    if "liability" in t or "liable" in t or "limitation of liability" in t:
        return "Liability"

    if "payment" in t or "fee" in t or "invoice" in t:
        return "Payment"

    if "confidential" in t or "non-disclosure" in t:
        return "Confidentiality"

    if "indemnify" in t or "indemnification" in t:
        return "Indemnification"

    if "force majeure" in t or "act of god" in t:
        return "Force Majeure"

    if "arbitration" in t or "dispute" in t or "litigation" in t:
        return "Dispute Resolution"

    if "governed by" in t or "jurisdiction" in t or "laws of" in t:
        return "Jurisdiction"

    if "intellectual property" in t or "ip rights" in t:
        return "Intellectual Property"

    return "Governing Law"
