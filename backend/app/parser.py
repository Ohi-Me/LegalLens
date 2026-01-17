import pdfplumber

def extract_text_from_pdf(file_path: str) -> str:
    pages = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text(
                x_tolerance=2,
                y_tolerance=2
            )
            if text:
                pages.append(text.strip())

    return "\n\n".join(pages)
