import re
import json
import os

def parse_and_merge():
    # 1. Parse Raw Text
    raw_path = 'scripts/raw_csif.txt'
    if not os.path.exists(raw_path):
        print(f"Raw file not found: {raw_path}")
        return

    with open(raw_path, 'r', encoding='utf-8') as f:
        content = f.read()

    chunks = re.split(r'Respuesta Correcta:', content, flags=re.IGNORECASE)
    new_questions = []
    
    # Logic copied from process_csif.py
    for i in range(len(chunks) - 1):
        q_body = chunks[i].strip()
        if i > 0:
            q_body = re.sub(r'^\s*[a-dA-D].*?(\n|$)', '', q_body, count=1).strip()
        
        next_chunk = chunks[i+1].strip()
        match_ans = re.match(r'\s*([a-d])($|\s)', next_chunk, re.IGNORECASE)
        if not match_ans:
             match_ans = re.match(r'\s*([a-dA-D])', next_chunk)
             
        if not match_ans:
            print(f"Skipping Q{i+1}: No answer found.")
            continue
            
        correct_char = match_ans.group(1).lower()
        q_body = re.sub(r'\+1$', '', q_body).strip()
        
        opt_matches = list(re.finditer(r'(^|\s)([a-d])\)\s', q_body, re.IGNORECASE | re.MULTILINE))
        if len(opt_matches) < 4:
            print(f"Skipping Q{i+1}: Not enough options.")
            continue
            
        last_4 = opt_matches[-4:]
        start_a = last_4[0].start()
        text_part = q_body[:start_a].strip()
        opts_part = q_body[start_a:]
        
        text_part = re.sub(r'BLOQUE\s+\d+.*', '', text_part, flags=re.IGNORECASE).strip()
        text_part = re.sub(r'^\d+\.?\s*', '', text_part).strip()

        start_indices = [m.start() - start_a for m in last_4]
        end_indices = [m.end() - start_a for m in last_4]
        
        opt_a = opts_part[end_indices[0]:start_indices[1]].strip()
        opt_b = opts_part[end_indices[1]:start_indices[2]].strip()
        opt_c = opts_part[end_indices[2]:start_indices[3]].strip()
        opt_d = opts_part[end_indices[3]:].strip()

        q_obj = {
            "id": f"csif_t1_{i+1}",
            "tema": "Tema 1: La Constitución",
            "pregunta": text_part,
            "opciones": { "a": opt_a, "b": opt_b, "c": opt_c, "d": opt_d },
            "correcta": correct_char,
            "explicacion": "",
            "origen": "CSIF"
        }
        new_questions.append(q_obj)

    print(f"Parsed {len(new_questions)} new CSIF questions.")

    # 2. Load Existing Data
    json_path = 'data/preguntas.json'
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            existing_questions = json.load(f)
    else:
        existing_questions = []

    print(f"Loaded {len(existing_questions)} existing questions.")

    # 3. Add 'origen: MAD' to existing questions if missing
    for q in existing_questions:
        if 'origen' not in q:
            q['origen'] = 'MAD'

    # 4. Remove old CSIF questions (if re-running) to avoid duplicates
    # Filter out anything with origen 'CSIF'
    existing_questions = [q for q in existing_questions if q.get('origen') != 'CSIF']
    
    # 5. Append New Questions
    final_questions = existing_questions + new_questions
    print(f"Total questions after merge: {len(final_questions)}")

    # 6. Save
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2, ensure_ascii=False)
    
    print("Successfully merged CSIF questions.")

if __name__ == "__main__":
    parse_and_merge()
