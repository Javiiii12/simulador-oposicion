import re
import json
import sys

def parse_csif(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Split by "Respuesta Correcta:"
    # The split will give us:
    # [0]: Text of Q1
    # [1]: Answer of Q1 + Text of Q2
    # [2]: Answer of Q2 + Text of Q3
    # ...
    
    chunks = re.split(r'Respuesta Correcta:', content, flags=re.IGNORECASE)
    
    questions_json = []
    
    # Process Q1 from chunks[0] + Answer from start of chunks[1]
    # Process Q2 from rest of chunks[1] + Answer from start of chunks[2]
    
    if len(chunks) < 2:
        print("No questions found (check 'Respuesta Correcta:' delimiter).")
        return

    # chunk[0] is just Q1 text/options. We need the answer from chunk[1].
    
    for i in range(len(chunks) - 1):
        q_body = chunks[i].strip()
        
        # If this is not the first chunk, it starts with the answer to the PREVIOUS question.
        # We need to remove that.
        if i > 0:
            # Matches: "B", "B \n", "B . \n" etc.
            # We already extracted it in previous iteration, but now we need to clean it from current text.
            q_body = re.sub(r'^\s*[a-dA-D].*?(\n|$)', '', q_body, count=1).strip()
        
        next_chunk = chunks[i+1].strip()
        
        # Format of next_chunk: "B \n\n Question 2..."
        # Extract the first character (or word) as the answer
        # Sometimes there's whitespace.
        
        match_ans = re.match(r'\s*([a-d])\s', next_chunk, re.IGNORECASE)
        if not match_ans:
             # Try stricter
             match_ans = re.match(r'\s*([a-d])($|\n)', next_chunk, re.IGNORECASE)

        if not match_ans:
            # Maybe the answer is "A" not "a)"
            match_ans = re.match(r'\s*([a-dA-D])', next_chunk)
            
        if not match_ans:
            print(f"Could not parse answer for Q{i+1}. Next chunk starts with: {next_chunk[:20]}")
            continue
            
        correct_char = match_ans.group(1).lower()
        
        # Now parse q_body for options and text
        # Options usually appear at the end: a) ... b) ... c) ... d) ...
        # We can regex from the end.
        
        # Remove trailing +1 or other noise if present
        q_body = re.sub(r'\+1$', '', q_body).strip()
        
        # Regex to find " a) "
        # We assume they are in order a, b, c, d
        
        # Pattern:
        # a\) (.*)
        # b\) (.*)
        # c\) (.*)
        # d\) (.*)
        
        # Since they might be multiline, we use DOTALL.
        # But we need to be careful not to match too early.
        
        # Let's find the LAST occurrence of " a) " or "\na) "
        opt_matches = list(re.finditer(r'(^|\s)([a-d])\)\s', q_body, re.IGNORECASE | re.MULTILINE))
        
        if len(opt_matches) < 4:
            print(f"Skipping Q{i+1}: Could not find 4 options. Found {len(opt_matches)}.")
            continue
            
        # Assume the last 4 matches are a, b, c, d
        # We need to verify they are a, b, c, d
        last_4 = opt_matches[-4:]
        
        # Check if they are a,b,c,d
        letters = [m.group(2).lower() for m in last_4]
        if letters != ['a', 'b', 'c', 'd']:
             # Try to find exactly a, b, c, d
             # ...
             pass
             
        # Extract content
        # Start of 'a)' options is last_4[0].start()
        
        start_a = last_4[0].start()
        text_part = q_body[:start_a].strip()
        opts_part = q_body[start_a:]
        
        # Clean text part
        # Remove header like "BLOQUE 1: ..."
        text_part = re.sub(r'BLOQUE\s+\d+.*', '', text_part, flags=re.IGNORECASE).strip()
        text_part = re.sub(r'^\d+\.?\s*', '', text_part).strip() # Remove numbering
        
        # Parse options from opts_part
        # We know positions of a, b, c, d from last_4
        
        # pos_a = last_4[0].start() - start_a -> 0
        pos_b = last_4[1].start() - start_a
        pos_c = last_4[2].start() - start_a
        pos_d = last_4[3].start() - start_a
        
        opt_a = opts_part[last_4[0].end() - start_a : pos_b].strip()
        opt_b = opts_part[last_4[1].end() - start_a : pos_c].strip()
        opt_c = opts_part[last_4[2].end() - start_a : pos_d].strip()
        opt_d = opts_part[last_4[3].end() - start_a : ].strip() # Until end
        
        q_obj = {
            "id": f"csif_t1_{i+1}",
            "tema": "Tema 1", # User wanted "Tema 1 La Constitución", actually "Tema 1" inside CSIF.
            # Wait, user said: "CSIF... Tema 1 La Constitución".
            # In MAD we have "Tema 1", "Tema 2".
            # If I name it "Tema 1", it might merge with MAD's Tema 1 if we don't differentiate.
            # But I will differentiate by 'origen'.
            # So I can just call it "Tema 1: La Constitución" to be descriptive.
            "tema": "Tema 1: La Constitución",
            "pregunta": text_part,
            "opciones": {
                "a": opt_a,
                "b": opt_b,
                "c": opt_c,
                "d": opt_d
            },
            "correcta": correct_char,
            "origen": "CSIF"
        }
        questions_json.append(q_obj)

    print(json.dumps(questions_json, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    parse_csif('scripts/raw_csif.txt')
