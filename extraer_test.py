import re
import json
import pdfplumber

def extraer_todoterreno(pdf_path):
    print(f"--- INICIANDO EXTRACCIÓN TODOTERRENO EN: {pdf_path} ---")
    
    preguntas_totales = []
    
    # Expresiones regulares MÁS FLEXIBLES (toleran espacios al principio)
    # Busca "1. Texto" o "1 . Texto" o "   1. Texto"
    patron_pregunta = re.compile(r'^\s*(\d+)\s*[\.\-]\s+(.*)', re.MULTILINE)
    # Busca "a) Texto" o "a ) Texto"
    patron_opcion = re.compile(r'^\s*([a-d])\s*\)\s+(.*)', re.IGNORECASE | re.MULTILINE)
    # Busca "Solución... n.º X"
    patron_cabecera_solucion = re.compile(r'Soluci[oó]n.*test', re.IGNORECASE)
    # Busca respuestas "1. b"
    patron_resp_correcta = re.compile(r'^\s*(\d+)\s*[\.\-]\s*([a-d])[\)\s]', re.IGNORECASE | re.MULTILINE)

    bloque_preguntas = {} 
    pregunta_actual_num = None
    texto_visto = False
    
    with pdfplumber.open(pdf_path) as pdf:
        print(f"El PDF tiene {len(pdf.pages)} páginas.")
        
        for i, page in enumerate(pdf.pages):
            texto_pagina = page.extract_text()
            if not texto_pagina:
                continue
                
            texto_visto = True
            # Debug: Imprimir la primera línea de texto real encontrada para ver si leemos bien
            if i == 5: # Miramos la página 5 aprox que suele tener contenido
                 print(f"--- MUESTRA DE TEXTO (PÁG {i}) ---\n{texto_pagina[:200]}\n-----------------------------------")

            lineas = texto_pagina.split('\n')
            modo_solucion = False
            
            # Detectamos si la página tiene pinta de ser de soluciones
            if any(patron_cabecera_solucion.search(l) for l in lineas):
                modo_solucion = True

            for linea in lineas:
                linea = linea.strip()
                if not linea: continue

                if not modo_solucion:
                    # Buscamos Preguntas
                    match_preg = patron_pregunta.match(linea)
                    match_opc = patron_opcion.match(linea)

                    if match_preg:
                        num = int(match_preg.group(1))
                        texto = match_preg.group(2)
                        # Guardamos la anterior si existe
                        pregunta_actual_num = num
                        bloque_preguntas[num] = {
                            "id": len(preguntas_totales) + len(bloque_preguntas) + 1,
                            "tema": "Test General", # Simplificado por seguridad
                            "pregunta": texto,
                            "opciones": {},
                            "correcta": "a", # Valor por defecto
                            "explicacion": ""
                        }
                    elif match_opc and pregunta_actual_num is not None:
                        letra = match_opc.group(1).lower()
                        bloque_preguntas[pregunta_actual_num]["opciones"][letra] = match_opc.group(2)

                else:
                    # Buscamos Soluciones (ej: "1. b")
                    match_resp = patron_resp_correcta.match(linea)
                    if match_resp:
                        num_preg = int(match_resp.group(1))
                        letra_corr = match_resp.group(2).lower()
                        
                        if num_preg in bloque_preguntas:
                            bloque_preguntas[num_preg]["correcta"] = letra_corr
                            # Si hay texto después, es la explicación
                            if len(linea.split(match_resp.group(0))) > 1:
                                bloque_preguntas[num_preg]["explicacion"] = linea.split(match_resp.group(0))[1].strip()
                            else:
                                bloque_preguntas[num_preg]["explicacion"] = "Ver temario oficial."
                                
                            # Pasamos a la lista final
                            preguntas_totales.append(bloque_preguntas[num_preg])
                            # Limpiamos del buffer temporal para no duplicar
                            del bloque_preguntas[num_preg]

    # Guardar
    if not texto_visto:
        print("ERROR GRAVE: No se encontró NINGÚN texto. El PDF podría ser una imagen escaneada.")
    else:
        print(f"--- FIN --- Se encontraron {len(preguntas_totales)} preguntas.")
        with open('preguntas.json', 'w', encoding='utf-8') as f:
            json.dump(preguntas_totales, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    extraer_todoterreno("pinche test mad CM.pdf")