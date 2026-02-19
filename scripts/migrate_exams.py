import json

def migration_split_exams():
    try:
        with open('data/preguntas.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        count = 0
        for q in data:
            if q.get('tema') == "Examen 2020":
                q['tema'] = "Examen 2020 (Ordinario)"
                count += 1
                
        with open('data/preguntas.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Updated {count} questions to 'Examen 2020 (Ordinario)'.")
        
    except FileNotFoundError:
        print("data/preguntas.json not found.")

if __name__ == "__main__":
    migration_split_exams()
