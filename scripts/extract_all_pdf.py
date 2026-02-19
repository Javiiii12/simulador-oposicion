import pdfplumber

def extract_all_text(pdf_path):
    print(f"📖 Extrayendo todo el texto de: {pdf_path}")
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                full_text += f"\n--- PÁGINA {i+1} ---\n{text}\n"
        
        with open("pdf_dump.txt", "w", encoding="utf-8") as f:
            f.write(full_text)
        print("✅ Texto guardado en pdf_dump.txt")

if __name__ == "__main__":
    extract_all_text('pinche test mad CM.pdf')
