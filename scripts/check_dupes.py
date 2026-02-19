import json
from collections import Counter

def check_duplicates():
    with open('data/preguntas.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    ids = [q['id'] for q in data]
    counts = Counter(ids)
    
    dupes = {k: v for k, v in counts.items() if v > 1}
    
    if dupes:
        print(f"Found {len(dupes)} duplicate IDs.")
        for k, v in list(dupes.items())[:10]:
            print(f"ID {k} appears {v} times.")
    else:
        print("No duplicate IDs found.")
        
    print(f"Total questions: {len(data)}")

if __name__ == "__main__":
    check_duplicates()
