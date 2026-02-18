import pdfplumber
import re

def find_solutions_in_pdf(pdf_path):
    print(f"📖 Analizando PDF: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total páginas: {total_pages}")
        
        # Estrategia: Buscar "Soluciones" o "Respuestas" en las últimas páginas o en todo el doc
        # A veces están al final de cada tema.
        
        matches = []
        
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if not text: continue
            
            # Buscamos patrones fuertes de soluciones
            # Ej: "Soluciones Test", "Clave de respuestas", "Soluciones Tema"
            if re.search(r'soluciones\s+test', text, re.IGNORECASE) or \
               re.search(r'respuestas\s+test', text, re.IGNORECASE) or \
               re.search(r'soluciones\s+tema', text, re.IGNORECASE):
                
                print(f"Found potential match on page {i+1}")
                matches.append((i, text))
                
                # Mostrar un preview
                print(f"--- Preview Page {i+1} ---")
        if not matches:
             print("Buscando en las últimas 20 páginas (manual check)...")
             for i in range(max(0, total_pages - 20), total_pages):
                 page = pdf.pages[i]
                 text = page.extract_text()
                 if text:
                     print(f"\n--- PÁGINA {i+1} ---")
                     print(text[:1000]) # Primeros 1000 chars

if __name__ == "__main__":
    find_solutions_in_pdf('pinche test mad CM.pdf')
