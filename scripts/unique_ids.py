import json
import re

def fix_ids():
    with open('data/preguntas.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # We want to keep 2020 IDs if they are unique
    # But for others, we want to generate stable IDs based on Topic.
    
    # Sort by Tema for consistency
    # data.sort(key=lambda x: x.get('tema', '')) 
    
    # Actually, let's just make them unique.
    # Pattern: "t{tema_num}_{question_index}"
    # Example: "t1_1", "t1_2"...
    
    counters = {}
    
    new_data = []
    for q in data:
        tema = q.get('tema', 'General')
        
        # Extract number from Tema
        tema_num_match = re.search(r'Tema (\d+)', tema)
        if tema_num_match:
            prefix = f"t{tema_num_match.group(1)}"
        elif "2020" in tema:
            prefix = "ex2020"
            # Keep original ID if it's already good? 
            # Original: 2020_1. Let's keep it if possible or standardize.
            # Let's standardize to "ex2020_1".
        else:
            prefix = "gen"
            
        if prefix not in counters:
            counters[prefix] = 1
            
        new_id = f"{prefix}_{counters[prefix]}"
        
        # If the question already has a "2020_" ID, preserving it might be nice but let's be consistent.
        # Actually, user just added 2020. They are fresh.
        # But wait, data/preguntas.json has EVERYTHING.
        
        q['id'] = new_id
        counters[prefix] += 1
        new_data.append(q)
        
    with open('data/preguntas.json', 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
        
    print(f"Fixed IDs for {len(new_data)} questions.")

if __name__ == "__main__":
    fix_ids()
