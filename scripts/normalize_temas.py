import json
import re

def normalize():
    path = 'data/preguntas.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    count = 0
    for q in data:
        tema = q.get('tema', '')
        old_tema = tema
        
        # Normalize Tema 1
        # Old: "CSIF Bloque 1: ...", "CSIF Bloque 2: ...", "CSIF Bloque 3: ..."
        # Desired: "Tema 1: La Constitución (Bloque 1 - Igualdad)"
        
        if "CSIF Bloque 1" in tema or "CSIF Bloque 1" in q.get('id', ''): 
            # Check strictly if it is NOT Tema 2
            if "Tema 2" not in tema:
                q['tema'] = "Tema 1: La Constitución (Bloque 1 - Igualdad CLM)"
        
        elif "CSIF Bloque 2" in tema or "CSIF Bloque 2" in q.get('id', ''):
            if "Tema 2" not in tema:
                q['tema'] = "Tema 1: La Constitución (Bloque 2 - Constitución 1978)"
        
        elif "CSIF Bloque 3" in tema or "CSIF Bloque 3" in q.get('id', ''):
            if "Tema 2" not in tema:
                q['tema'] = "Tema 1: La Constitución (Bloque 3 - Violencia Género)"

        # Normalize Tema 2
        # Old: "CSIF Tema 2 Bloque 1: ...", "CSIF Tema 2 Bloque 2: ..."
        elif "CSIF Tema 2 Bloque 1" in tema:
             q['tema'] = "Tema 2: Estatuto y Transparencia (Bloque 1 - Estatuto)"
        elif "CSIF Tema 2 Bloque 2" in tema:
             q['tema'] = "Tema 2: Estatuto y Transparencia (Bloque 2 - Transparencia)"
             
        # Normalize Tema 3
        elif "CSIF Tema 3" in tema:
             q['tema'] = "Tema 3: Ley General de Sanidad"

        if q['tema'] != old_tema:
            count += 1

    print(f"Updated {count} questions.")
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    normalize()
