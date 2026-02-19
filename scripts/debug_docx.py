import docx
import re

def inspect_docx(file_path):
    print(f"📂 Inspeccionando: {file_path}")
    doc = docx.Document(file_path)
    
    found_headers = []
    
    # Regex para buscar "Test n.º X"
    re_header = re.compile(r'Test\s+n\.º\s+(\d+)', re.IGNORECASE)

    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        if not text: continue
        
        # Buscar patrones de título
        if re_header.search(text) or "Constitución" in text or "Estatuto" in text:
            print(f"Line {i}: {text[:100]}...")
            found_headers.append(text)
            
    print(f"\n✅ Posibles cabeceras encontradas: {len(found_headers)}")

if __name__ == "__main__":
    inspect_docx('pinche test mad CM.docx')
