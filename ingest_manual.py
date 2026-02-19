import re
import json
import os

def ingest_manual_data():
    input_file = 'manual_input.txt'
    output_file = 'data/preguntas.json'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()

    # Regex patterns
    # Header: "Test n.º 11: ..." or "Test n.º 12: ..." or "Test n.º 14..."
    # We look for "Test n.º" followed by a number.
    re_header = re.compile(r'Test n\.º\s+(\d+)', re.IGNORECASE)
    
    # Question: "1. ¿Pregunta?"
    re_preg = re.compile(r'^(\d+)\.\s+(.*)')
    # Option: "a) Texto"
    re_opt = re.compile(r'^([a-d])\)\s+(.*)')
    # Solution: "Solución: x"
    re_sol = re.compile(r'Solución:\s*([a-d])', re.IGNORECASE)

    current_tema = "Tema 11" # Default to Tema 11 for the first block if no header is found immediately
    current_q = None
    questions = []
    
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue

        # Check Topic Change
        match_header = re_header.search(line)
        if match_header:
            tema_num = match_header.group(1)
            current_tema = f"Tema {tema_num}"
            print(f"🔹 Cambio de tema detectado: {current_tema}")
            continue

        # Check Question
        match_preg = re_preg.match(line)
        if match_preg:
            # Save previous if exists
            if current_q:
                questions.append(current_q)
            
            q_id = int(match_preg.group(1))
            q_text = match_preg.group(2)
            current_q = {
                "id": q_id,
                "tema": current_tema,
                "pregunta": q_text,
                "opciones": {},
                "correcta": "a", # Default until found
                "explicacion": ""
            }
            continue

        # Check Option
        match_opt = re_opt.match(line)
        if match_opt and current_q:
            letter = match_opt.group(1).lower()
            opt_text = match_opt.group(2)
            current_q["opciones"][letter] = opt_text
            continue

        # Check Solution
        match_sol = re_sol.match(line)
        if match_sol and current_q:
            sol_letter = match_sol.group(1).lower()
            current_q["correcta"] = sol_letter
            continue

    # Append last question
    if current_q:
        questions.append(current_q)

    print(f"✅ Procesadas {len(questions)} preguntas manuales totales.")
    
    existing = []
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            try:
                existing = json.load(f)
            except json.JSONDecodeError:
                existing = []
    
    # Identify topics present in the new set
    themes_updating = {q['tema'] for q in questions}
    print(f"Reemplazando temas: {themes_updating}")
    
    # Remove OLD data for these topics implies we keep everything ELSE.
    final_dataset = [q for q in existing if q['tema'] not in themes_updating]
    
    # Add new questions
    final_dataset.extend(questions)
    
    # Sort by Tema number
    def sort_key(q):
        try:
            # Extract number from "Tema X"
            return int(q['tema'].replace("Tema ", ""))
        except:
            return 999

    final_dataset.sort(key=sort_key)
    
    # Print stats
    stats = {}
    for q in final_dataset:
        t = q['tema']
        stats[t] = stats.get(t, 0) + 1
    
    print("📊 Estadísticas finales de preguntas:")
    for t, count in stats.items():
        print(f"  - {t}: {count} preguntas")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Guardado {output_file} con {len(final_dataset)} preguntas totales.")

if __name__ == "__main__":
    ingest_manual_data()
