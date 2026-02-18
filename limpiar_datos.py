import json
import re

def limpiar_datos():
    try:
        with open('data/preguntas.json', 'r', encoding='utf-8') as f:
            datos = json.load(f)
    except FileNotFoundError:
        print("❌ No se encontró data/preguntas.json")
        return

    print(f"📉 Analizando {len(datos)} entradas...")
    
    preguntas_limpias = []
    
    # Palabras clave para asignar temas (heurística simple)
    keywords_constitucion = ['constitución', 'derecho', 'estado', 'funda', 'española', 'título']
    keywords_estatuto = ['estatuto', 'autonomía', 'castilla', 'mancha', 'cortes', 'junta']
    keywords_igualdad = ['igualdad', 'género', 'mujer', 'violencia', 'discriminación']
    keywords_celador = ['celador', 'movilización', 'paciente', 'cama', 'aseo']
    keywords_cocina = ['cocina', 'alimento', 'dieta', 'nutrición', 'bromatología', 'conservación', 'refrigeración']

    for p in datos:
        # Limpieza básica de texto
        txt = p['pregunta'].replace('General', '').strip()
        
        # Eliminar números iniciales residuales (ej: "1. ¿Cuál es...?" -> "¿Cuál es...?")
        txt = re.sub(r'^\d+[\.\-\)]\s*', '', txt)
        p['pregunta'] = txt

        # 1. Filtro: Si es MUY corta, probable basura
        if len(txt) < 10: 
            continue

        # 2. Heurística de Temas
        tema_asignado = "Generales" # Default
        texto_lower = (txt + " " + str(p['opciones'])).lower()

        if any(w in texto_lower for w in keywords_constitucion):
            tema_asignado = "Tema 1: Constitución"
        elif any(w in texto_lower for w in keywords_estatuto): 
            tema_asignado = "Tema 2: Estatuto Autonomía"
        elif any(w in texto_lower for w in keywords_igualdad):
            tema_asignado = "Tema 3: Igualdad y Género"
        elif any(w in texto_lower for w in keywords_celador):
            tema_asignado = "Tema: Celador"
        elif any(w in texto_lower for w in keywords_cocina):
            tema_asignado = "Tema: Cocina y Alimentos"
        
        p['tema'] = tema_asignado
        p['categoria'] = "MAD" # Todo al bucket MAD por ahora

        # 3. Validar Opciones
        # Si tiene menús de 2 opciones, la aceptamos pero marcamos warning
        if len(p['opciones']) < 2:
            # Intentar recuperar opciones del texto si es posible (muy difícil sin IA avanzada)
            continue 

        preguntas_limpias.append(p)

    # Reasignar IDs
    for i, p in enumerate(preguntas_limpias):
        p['id'] = i + 1

    print(f"✅ Se han conservado {len(preguntas_limpias)} preguntas tras la limpieza suave.")

    with open('data/preguntas.json', 'w', encoding='utf-8') as f:
        json.dump(preguntas_limpias, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    limpiar_datos()
