import json
import re
import os

def ingest_extraordinario():
    input_file = 'data/examen_2020_extra_raw.txt'
    output_file = 'data/preguntas.json'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    questions = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize newlines
    lines = content.split('\n')
    
    current_q = None
    
    # Regex patterns
    # Starts with "1. " or "105. "
    q_start_pattern = re.compile(r'^(\d+)\.\s+(.*)')
    # Option "a) ..."
    opt_pattern = re.compile(r'^([a-d])\)\s+(.*)')
    # Answer "Respuesta Correcta: x"
    ans_pattern = re.compile(r'^Respuesta Correcta:\s*([a-d])', re.IGNORECASE)
    
    raw_questions_dict = {} # Map number -> question obj
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check Question Start
        match_start = q_start_pattern.match(line)
        if match_start:
            q_num = int(match_start.group(1))
            q_text = match_start.group(2)
            
            # Save previous if exists
            if current_q:
                raw_questions_dict[current_q['num']] = current_q
                
            current_q = {
                'num': q_num,
                'id': f"2020_extra_{q_num}", # Temp ID
                'tema': "Examen 2020 (Extraordinario)",
                'pregunta': q_text,
                'opciones': {},
                'correcta': '',
                'explicacion': ''
            }
            continue
            
        if current_q:
            # Check Option
            match_opt = opt_pattern.match(line)
            if match_opt:
                letter = match_opt.group(1).lower()
                text = match_opt.group(2)
                current_q['opciones'][letter] = text
                continue
                
            # Check Answer
            match_ans = ans_pattern.match(line)
            if match_ans:
                current_q['correcta'] = match_ans.group(1).lower()
                continue
                
            # Extra text handling (e.g. notes after answer)
            if "ANULADA" in line:
                current_q['pregunta'] += " [ANULADA]"
                # We will handle substitution logic later
                
            # Fallback: Multiline question text if no options yet
            if not current_q['opciones'] and not match_ans:
                current_q['pregunta'] += " " + line

    # Add last question
    if current_q:
        raw_questions_dict[current_q['num']] = current_q
        
    print(f"Parsed {len(raw_questions_dict)} questions.")

    # --- SUBSTITUTION LOGIC ---
    # 45 -> 101
    # 80 -> 102
    
    if 101 in raw_questions_dict and 45 in raw_questions_dict:
        print("Substituting 45 with 101...")
        q45 = raw_questions_dict[45]
        q101 = raw_questions_dict[101]
        
        q45['pregunta'] = q101['pregunta'] # Use reservoir question text
        q45['opciones'] = q101['opciones']
        q45['correcta'] = q101['correcta']
        # We can append a note
        q45['explicacion'] = "Pregunta sustituta de la original anulada (Reserva 101)."
        
    if 102 in raw_questions_dict and 80 in raw_questions_dict:
        print("Substituting 80 with 102...")
        q80 = raw_questions_dict[80]
        q102 = raw_questions_dict[102]
        
        q80['pregunta'] = q102['pregunta']
        q80['opciones'] = q102['opciones']
        q80['correcta'] = q102['correcta']
        q80['explicacion'] = "Pregunta sustituta de la original anulada (Reserva 102)."

    # Listify
    new_questions = list(raw_questions_dict.values())
    
    # Handle implicit answers for 103, 104, 105 if missing
    # User text says: "(No evaluada en la plantilla principal, pero en base a normativa la correcta es la A)."
    # My regex might parse "Respuesta Correcta: " but these don't have it exactly?
    # Let's check the text provided.
    # "103... \n a)... \n (No evaluada... la correcta es la A)."
    # The Loop might miss the answer.
    
    # Manual fix for 103, 104, 105 based on user input text pattern
    for q in new_questions:
        if q['num'] == 103 and not q['correcta']:
            q['correcta'] = 'a'
        if q['num'] == 104 and not q['correcta']:
            q['correcta'] = 'c'
        if q['num'] == 105 and not q['correcta']:
            q['correcta'] = 'a'
            
    # Load existing
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    except:
        existing_data = []
        
    # Append
    existing_data.extend(new_questions)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
    print(f"Added {len(new_questions)} questions to {output_file}")

if __name__ == "__main__":
    ingest_extraordinario()
