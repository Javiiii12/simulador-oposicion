import json
import re

def parse_exam_2020(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Split by double newlines or "Respuesta: x" to find blocks
    # Better: Split by question number pattern "^\d+\."
    
    # Normalize line endings
    text = text.replace('\r\n', '\n')
    
    # Split into blocks starting with "Number. "
    blocks = re.split(r'\n(?=\d+\.)', text)
    
    questions = []
    
    for block in blocks:
        block = block.strip()
        if not block: continue
        
        # Regex to parse:
        # 1. Question Text
        # a) Option A
        # ...
        # Respuesta: X
        
        # Match Number. Question Text
        match_header = re.match(r'^(\d+)\.\s+(.*)', block, re.DOTALL)
        if not match_header:
            print(f"Skipping block (no header): {block[:50]}...")
            continue
            
        num = match_header.group(1)
        rest = match_header.group(2)
        
        # Find options
        # Look for "a) ", "b) ", etc.
        # We assume they appear in order
        
        # We will split by newlines and look for patterns
        lines = rest.split('\n')
        question_text = []
        options = {}
        correct_answer = ''
        
        current_part = 'question'
        current_letter = ''
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Check for correct answer
            if line.lower().startswith("respuesta:"):
                correct_answer = line.split(":", 1)[1].strip().lower()[0] # Take first char 'a', 'b', etc
                continue
                
            # Check for options
            match_opt = re.match(r'^([a-d])\)\s+(.*)', line)
            if match_opt:
                current_letter = match_opt.group(1).lower()
                options[current_letter] = match_opt.group(2)
                current_part = 'option'
            else:
                if current_part == 'question':
                    question_text.append(line)
                elif current_part == 'option':
                    # Append to previous option if multiline
                    if current_letter:
                        options[current_letter] += " " + line

        full_question = " ".join(question_text)
        
        # Validate
        if not correct_answer:
            # Maybe it's an anulled question like 42 or 80
            if "ANULADA" in full_question:
                print(f"Question {num} is ANULADA.")
                # We can still add it but maybe mark it? 
                # Actually, logic below handles substitution 
                # For now let's just add it, maybe with empty options?
                pass
        
        if len(options) < 4 and "ANULADA" not in full_question:
             print(f"Warning: Question {num} has fewer than 4 options.")

        # Create Question Object
        q_obj = {
            "id": f"2020_{num}",
            "tema": "Examen 2020",
            "pregunta": full_question,
            "opciones": options,
            "correcta": correct_answer
        }
        questions.append(q_obj)

    return questions

def ingest():
    questions_2020 = parse_exam_2020("data/examen_2020_raw.txt")
    print(f"Parsed {len(questions_2020)} questions.")
    
    # Handle Substitutions
    # 42 -> 101
    # 80 -> 102
    
    map_questions = {q['id']: q for q in questions_2020}
    
    # Check if 42 is anulled
    if '2020_42' in map_questions and '2020_101' in map_questions:
        print("Substituting 42 with 101...")
        map_questions['2020_42']['pregunta'] = map_questions['2020_101']['pregunta']
        map_questions['2020_42']['opciones'] = map_questions['2020_101']['opciones']
        map_questions['2020_42']['correcta'] = map_questions['2020_101']['correcta']
        
    if '2020_80' in map_questions and '2020_102' in map_questions:
        print("Substituting 80 with 102...")
        map_questions['2020_80']['pregunta'] = map_questions['2020_102']['pregunta']
        map_questions['2020_80']['opciones'] = map_questions['2020_102']['opciones']
        map_questions['2020_80']['correcta'] = map_questions['2020_102']['correcta']

    # Final list (Keeping 101-105 as reserves or just keep all?)
    # User said "Cuestionario Completo (105 Preguntas)". Let's keep all.
    final_list = list(map_questions.values())
    
    # Load existing
    try:
        with open('data/preguntas.json', 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except FileNotFoundError:
        existing = []
        
    # Remove old Examen 2020 if exists
    existing = [q for q in existing if q.get('tema') != "Examen 2020"]
    
    # Merge
    existing.extend(final_list)
    
    # Save
    with open('data/preguntas.json', 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print("Done. Saved to data/preguntas.json")

if __name__ == "__main__":
    ingest()
