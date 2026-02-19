import re
import json
import os

def ingest_manual_data():
    input_file = 'manual_input.txt'
    output_file = 'data/preguntas.json'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()

    # Regex patterns
    # Bloque Header: "Bloque I: La Constitución..."
    re_bloque = re.compile(r'Bloque ([IVX]+): (.*)', re.IGNORECASE)
    # Question: "1. ¿Pregunta?"
    re_preg = re.compile(r'^(\d+)\.\s+(.*)')
    # Option: "a) Texto"
    re_opt = re.compile(r'^([a-d])\)\s+(.*)')
    # Solution: "Solución: x"
    re_sol = re.compile(r'Solución:\s*([a-d])', re.IGNORECASE)

    # Force everything to Tema 3 as requested by User
    current_tema = "Tema 3"
    current_q = None
    questions = []
    
    # regex patterns...
    # ...
    # We can ignore 'Bloque' headers or just print them.

    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue

        # Check Topic Change (detect headers but DO NOT change current_tema)
        match_bloque = re_bloque.match(line)
        if match_bloque:
            print(f"🔹 Bloque detectado (ignoring change, keeping {current_tema}): {match_bloque.group(0)}")
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

    print(f"✅ Procesadas {len(questions)} preguntas manuales.")
    
    # Load existing JSON if exists (to merge or replace?)
    # User said: "Te paso el primero para ver como sale" -> Probably replace to be clean, or merge.
    # Safe strategy: Load existing, filter out these IDs/Topics, and append new.
    # BUT existing data is messy ("Tema 1: 'i 1l").
    # Let's clean replace for the demo topics (Tema 1 & Tema 5).
    
    existing = []
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    
    # Filter out existing questions for the themes we are updating
    # themes_to_replace = ["Tema 1", "Tema 5"]
    # filtered_existing = [q for q in existing if q['tema'] not in themes_to_replace]
    
    # OR better: Start fresh with ONLY valid data to show the user "PERFECTION".
    # User said "questions are wrong". Mixing bad data with good might confuse.
    # I will create a hybrid: Keep specific topics I haven't touched, but RELY on this manual data for what I have.
    # Actually, for the "Demo", let's prioritize the manual data.
    
    # Let's MERGE. If we have manual data, use it.
    
    final_data = []
    # Add manual questions first (top priority)
    final_data.extend(questions)
    
    # Add existing questions ONLY if they are NOT from the manual topics? 
    # Or just add them all? The manual IDs are 1..10 and 81..113.
    # Let's just keep the manual ones at the top and maybe keep the others for "bulk".
    # But wait, User complained about bad questions preventing "Next".
    # If I keep the bad ones, the user might still see them.
    # DECISION: I will overwite `preguntas.json` with ONLY the manual data + the existing data that is NOT Tema 1 or Tema 5, to "clean" those topics.
    
    # Determine which topics are completely replaced by manual entry
    # In this case, since we forced everything to "Tema 1", we replace "Tema 1".
    themes_updating = {q['tema'] for q in questions}
    # ALSO, since user said "PONLAS SOLO EN EL TEMA1" and these questions cover what might have been Tema 5,
    # we should probably NOT remove Tema 5 if it exists separate (unless these *are* Tema 5).
    # But current_tema is strictly "Tema 1".
    # So we only scrub "Tema 1" from existing.
    
    print(f"Reemplazando temas: {themes_updating}")
    
    clean_existing = [q for q in existing if q['tema'] not in themes_updating]
    
    final_dataset = clean_existing + questions
    
    # Re-sort/Index if needed? Not strictly necessary.
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)
        
    print(f"💾 Guardado {output_file} con {len(final_dataset)} preguntas.")

if __name__ == "__main__":
    ingest_manual_data()
