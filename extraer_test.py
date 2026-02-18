import docx
import json
import re
import os

def extractor_final(file_path):
    print(f"📂 Procesando archivo: {file_path}")
    try:
        doc = docx.Document(file_path)
        
        preguntas = []
        current_pregunta = None
        current_tema = "General"
        
        # Regex para detectar cabeceras de Tema
        # Ej: "Test n.º 1. La Constitución Española..."
        re_tema_header = re.compile(r'^Test\s+n\.º\s+(\d+)\.\s+(.*)', re.IGNORECASE)
        
        # Regex para detectar inicio de pregunta (numero + algo)
        # Ej: "1. La pena de muerte..."
        re_inicio_pregunta = re.compile(r'^(\d+)[\.\-\)\s]+(.*)')
        
        # Regex para opciones (a) ... b) ...)
        re_opcion = re.compile(r'^([a-dA-D])[\)\.\-\s]+(.*)')

        for para in doc.paragraphs:
            text = para.text.strip()
            if not text: continue

            # 1. Detectar cambio de TEMA
            match_header = re_tema_header.match(text)
            if match_header:
                num_tema = match_header.group(1)
                titulo_tema = match_header.group(2).strip()
                current_tema = f"Tema {num_tema}: {titulo_tema}"
                print(f"📑 Detectado: {current_tema}")
                continue

            # 2. Detectar PREGUNTA
            match_preg = re_inicio_pregunta.match(text)
            if match_preg:
                # Guardar la anterior si existe
                if current_pregunta:
                    preguntas.append(current_pregunta)

                # Nueva pregunta
                current_pregunta = {
                    "id": len(preguntas) + 1,
                    "tema": current_tema,
                    "pregunta": match_preg.group(2).strip(),
                    "opciones": {},
                    "correcta": "a", # Placeholder
                    "explicacion": ""
                }
                continue

            # 3. Detectar OPCIÓN o CONTINUACIÓN
            if current_pregunta:
                match_opc = re_opcion.match(text)
                if match_opc:
                    letra = match_opc.group(1).lower()
                    texto_opc = match_opc.group(2).strip()
                    current_pregunta["opciones"][letra] = texto_opc
                else:
                    # Si no es opción, puede ser continuación de la pregunta o de la última opción
                    # Heurística: Si ya tiene opciones, es continuacion de la última opción.
                    # Si no, es continuación de la pregunta.
                    if current_pregunta["opciones"]:
                        last_key = list(current_pregunta["opciones"].keys())[-1]
                        current_pregunta["opciones"][last_key] += " " + text
                    else:
                        current_pregunta["pregunta"] += " " + text

        # Añadir la última
        if current_pregunta:
            preguntas.append(current_pregunta)

        print(f"✅ Total preguntas extraídas: {len(preguntas)}")

        # Guardar
        import os
        os.makedirs('data', exist_ok=True)
        with open('data/preguntas.json', 'w', encoding='utf-8') as f:
            json.dump(preguntas, f, ensure_ascii=False, indent=2)
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    extractor_final('pinche test mad CM.docx')