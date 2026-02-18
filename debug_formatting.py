import docx

def debug_formatting(file_path):
    doc = docx.Document(file_path)
    print("--- Analizando Formato de Opciones (Negrita/Subrayado) ---")
    
    count = 0
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text: continue
        
        # Si parece una opción (a) ... b) ...)
        if text.startswith('a)') or text.startswith('b)') or text.startswith('c)') or text.startswith('d)'):
            print(f"\nOpción encontrada: {text[:50]}...")
            for run in para.runs:
                if run.bold:
                    print(f"  [BOLD] '{run.text}'")
                if run.underline:
                    print(f"  [UNDERLINE] '{run.text}'")
            count += 1
            if count > 20: break

if __name__ == "__main__":
    debug_formatting('pinche test mad CM.docx')
