import re
import json
import os

def parse_exam(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by double newline or similar to isolate questions
    # But the raw text is sometimes single newline or double.
    # We can use a regex to find each question block.
    # Pattern: Usually starts with text, ends with "Respuesta: [A-D]"
    
    pattern = re.compile(r'(.*?):\s+a\)\s+(.*?)\s+b\)\s+(.*?)\s+c\)\s+(.*?)\s+d\)\s+(.*?)\s+Respuesta:\s+([A-D])', re.DOTALL | re.IGNORECASE)
    
    matches = pattern.findall(content)
    
    questions = []
    for i, match in enumerate(matches):
        q_text, opt_a, opt_b, opt_c, opt_d, answer = match
        
        # Clean up
        q_text = q_text.strip()
        # Remove leading newlines/numbering if any
        q_text = re.sub(r'^\d+\.\s*', '', q_text)
        # Handle "(Pregunta de Reserva...)"
        
        questions.append({
            "id": f"cel_2024_{i+1}",
            "tema": "Examen Oficial Celador/a SESCAM 2024",
            "pregunta": q_text,
            "opciones": {
                "a": opt_a.strip(),
                "b": opt_b.strip(),
                "c": opt_c.strip(),
                "d": opt_d.strip()
            },
            "correcta": answer.lower().strip(),
            "explicacion": "",
            "origen": "Histo"
        })
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"Parsed {len(questions)} questions.")

if __name__ == "__main__":
    raw_path = r'c:\Users\34678\Desktop\web-test-pinche\data\celador_2024_raw.txt'
    json_path = r'c:\Users\34678\Desktop\web-test-pinche\data\sescam_2024_celador.json'
    parse_exam(raw_path, json_path)
