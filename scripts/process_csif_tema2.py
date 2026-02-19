import re
import json
import os

def clean_question_start(text):
    # Remove leading numbering "1. ", "2. ", etc.
    text = re.sub(r'^\s*\d+[\.\)]\s*', '', text).strip()
    return text

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
        
        q_body = clean_question_start(q_body)
        
        # Extract Options
        opt_matches = list(re.finditer(r'(^|\s)([a-d])\)\s', q_body, re.IGNORECASE | re.MULTILINE))
        
        if len(opt_matches) < 4:
            continue
            
        last_4 = opt_matches[-4:]
        
        start_a = last_4[0].start()
        text_part = q_body[:start_a].strip()
        opts_part = q_body[start_a:]
        
        text_part = clean_question_start(text_part)

        start_indices = [m.start() - start_a for m in last_4]
        indices_end = [m.end() - start_a for m in last_4]
        
        opt_a = opts_part[indices_end[0] : start_indices[1]].strip()
        opt_b = opts_part[indices_end[1] : start_indices[2]].strip()
        opt_c = opts_part[indices_end[2] : start_indices[3]].strip()
        opt_d = opts_part[indices_end[3] : ].strip()

        q_obj = {
            "id": f"csif_{tema_name.replace(':', '').replace(' ','_')}_{start_id_index + i}",
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
    path = 'scripts/raw_csif_tema2.txt'
    with open(path, 'r', encoding='utf-8') as f:
        full_content = f.read()

    # Split into 2 blocks.
    # Header 2: "BLOQUE 2:" (or "BLOQUE: Ley de Transparencia") - File says "BLOQUE 2: Ley de Transparencia"
    
    m2 = re.search(r'BLOQUE 2:', full_content, re.IGNORECASE)
    
    if not m2:
         # Fallback to just splitting by string "BLOQUE 2" if re search failed for context
         parts = full_content.split('BLOQUE 2:')
         if len(parts) < 2:
             print("Could not split blocks.")
             return
         content1 = parts[0]
         content2 = parts[1]
    else:
        content1 = full_content[:m2.start()]
        content2 = full_content[m2.start():]
    
    questions = []
    
    print("Parsing Tema 2 Block 1...")
    q1 = parse_block_content(content1, "CSIF Tema 2 Bloque 1: Estatuto Autonomía", 100)
    questions.extend(q1)
    
    print("Parsing Tema 2 Block 2...")
    q2 = parse_block_content(content2, "CSIF Tema 2 Bloque 2: Ley Transparencia", 200)
    questions.extend(q2)
    
    print(f"Parsed {len(questions)} new questions for Tema 2.")
    
    # Merge
    json_path = 'data/preguntas.json'
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    else:
        existing = []
    
    # Check if we already have Tema 2 to avoid dups? 
    # Just filter out by ID prefix or tema name if re-running
    existing = [q for q in existing if not q['tema'].startswith('CSIF Tema 2')]

    final = existing + questions
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(final, f, indent=2, ensure_ascii=False)
        
    print("Saved 'data/preguntas.json'.")

if __name__ == "__main__":
    process()
