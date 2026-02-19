import re
import json
import os

def clean_question_start(text):
    # Remove "1++ ++ 1", "+1", "+", numbering like "1. ", etc.
    # Also remove "Parte A/B..." headers if they appear at start of line
    
    # 1. Remove specific artifacts
    text = re.sub(r'^\s*\+1\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\+\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\+\+\s*\+\+\s*\d+\s*', '', text, flags=re.MULTILINE)
    
    # 2. Remove "Parte X: ..."
    text = re.sub(r'Parte [A-B]:.*', '', text, flags=re.IGNORECASE)
    
    # 3. Remove leading numbering usually found at start of question text
    # e.g. "1. ¿Qué...?"
    text = re.sub(r'^\s*\d+[\.\)]\s*', '', text).strip()
    
    return text.strip()

def parse_block_content(content, tema_name, start_id_index):
    # Split by "Respuesta Correcta:"
    chunks = re.split(r'Respuesta Correcta:', content, flags=re.IGNORECASE)
    
    questions = []
    
    for i in range(len(chunks) - 1):
        q_body = chunks[i].strip()
        
        # If i > 0, remove previous answer from start
        if i > 0:
            q_body = re.sub(r'^\s*[a-dA-D].*?(\n|$)', '', q_body, count=1).strip()
            
        next_chunk = chunks[i+1].strip()
        
        # Extract Answer
        match_ans = re.match(r'\s*([a-d])($|\s)', next_chunk, re.IGNORECASE)
        if not match_ans:
             match_ans = re.match(r'\s*([a-dA-D])', next_chunk)
        
        if not match_ans:
            continue
            
        correct_char = match_ans.group(1).lower()
        
        # Clean q_body
        q_body = clean_question_start(q_body)
        
        # Extract Options
        # Find last a) ... b) ... c) ... d) ...
        opt_matches = list(re.finditer(r'(^|\s)([a-d])\)\s', q_body, re.IGNORECASE | re.MULTILINE))
        
        if len(opt_matches) < 4:
            continue
            
        last_4 = opt_matches[-4:]
        
        start_a = last_4[0].start()
        text_part = q_body[:start_a].strip()
        opts_part = q_body[start_a:]
        
        # Final clean of text_part
        text_part = clean_question_start(text_part)

        start_indices = [m.start() - start_a for m in last_4]
        indices_end = [m.end() - start_a for m in last_4]
        
        # Calculate end of each option. 
        # a ends at start of b
        # d ends at end of string
        
        # Correctly slicing:
        # a starts at indices_end[0] -> ends at start_indices[1]
        
        opt_a = opts_part[indices_end[0] : start_indices[1]].strip()
        opt_b = opts_part[indices_end[1] : start_indices[2]].strip()
        opt_c = opts_part[indices_end[2] : start_indices[3]].strip()
        opt_d = opts_part[indices_end[3] : ].strip()

        q_obj = {
            "id": f"csif_{tema_name.split(':')[0].replace(' ','_')}_{start_id_index + i}",
            "tema": tema_name,
            "pregunta": text_part,
            "opciones": { "a": opt_a, "b": opt_b, "c": opt_c, "d": opt_d },
            "correcta": correct_char,
            "explicacion": "",
            "origen": "CSIF"
        }
        questions.append(q_obj)
        
    return questions

def process():
    path = 'scripts/raw_csif.txt'
    with open(path, 'r', encoding='utf-8') as f:
        full_content = f.read()

    # Robust Splitting Strategy
    # Split by "BLOQUE X:" headers, keeping the headers
    parts = re.split(r'(BLOQUE [123]:)', full_content, flags=re.IGNORECASE)
    
    questions = []
    
    # parts[0] is preamble.
    # parts[1] is separator (e.g. "BLOQUE 1:")
    # parts[2] is content for that separator
    # ...
    
    current_block = None
    
    for i in range(1, len(parts), 2):
        header = parts[i].upper() # "BLOQUE 1:"
        content = parts[i+1]
        
        block_num = None
        if "1" in header: block_num = 1
        elif "2" in header: block_num = 2
        elif "3" in header: block_num = 3
        
        if block_num:
            print(f"Processing content for Block {block_num} (Length: {len(content)} chars)...")
            
            if block_num == 1:
                qs = parse_block_content(content, "CSIF Bloque 1: Ley Igualdad CLM", 100)
            elif block_num == 2:
                qs = parse_block_content(content, "CSIF Bloque 2: Constitución Española", 200)
            elif block_num == 3:
                qs = parse_block_content(content, "CSIF Bloque 3: Violencia de Género", 300)
                
            print(f"  -> Found {len(qs)} questions.")
            questions.extend(qs)

    print(f"Total parsed: {len(questions)}")
    
    # Merge
    json_path = 'data/preguntas.json'
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            existing_questions = json.load(f)
    else:
        existing_questions = []
        
    # Remove old Tema 1 questions (if re-running) to avoid duplicates
    # This matches both old names ("CSIF Bloque X") and normalised names ("Tema 1:...")
    existing_questions = [
        q for q in existing_questions 
        if not (
            (q.get('origen') == 'CSIF') and 
            (
                "CSIF Bloque" in q.get('tema', '') or 
                "Tema 1:" in q.get('tema', '')
            )
        )
    ]
    
    # Append New Questions
    new_questions = questions
    final_questions = existing_questions + new_questions
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2, ensure_ascii=False)
        
    print(f"Saved 'data/preguntas.json'. Merged {len(new_questions)} items.")

if __name__ == "__main__":
    process()
