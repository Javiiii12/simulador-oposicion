import docx
from docx.document import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import _Cell, Table
from docx.text.paragraph import Paragraph
import json
import re
import os

def iter_block_items(parent):
    if isinstance(parent,  docx.document.Document):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        raise ValueError("something's not right")

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def extractor_final(file_path):
    print(f"📂 Procesando archivo: {file_path}")
    try:
        doc = docx.Document(file_path)
        
        preguntas = []
        current_pregunta = None
        # Tema por defecto inicial
        current_tema = "Tema 1: Constitución"
        
        # Regex para detectar cabeceras de Tema
        # 1. Con separador: "TEST h.°1", "Test n.º 16"
        re_tema_header_strict = re.compile(r'TEST.*?[°º\.]+\s*(\d+)(.*)', re.IGNORECASE)
        # 2. Sin separador (más riesgo): "Test 2"
        re_tema_header_lax = re.compile(r'TEST\s+(\d+)(.*)', re.IGNORECASE)
        
        # Regex para detectar inicio de pregunta (numero + algo O solo numero)
        # Ej: "1. Pregunta" o "1" (en celda)
        re_inicio_pregunta = re.compile(r'^(\d+)([\.\-\)\s]+.*)?$')
        
        # Regex para opciones
        re_opcion = re.compile(r'^([a-dA-D])[\)\.\-\s]+(.*)')

        total_lines = 0

        for block in iter_block_items(doc):
            text_blocks = []
            if isinstance(block, Paragraph):
                if block.text.strip(): text_blocks.append(block.text.strip())
            elif isinstance(block, Table):
                for row in block.rows:
                    for cell in row.cells:
                        for para in cell.paragraphs:
                            if para.text.strip(): text_blocks.append(para.text.strip())
            
            for text in text_blocks:
                total_lines += 1
                text = text.strip()
                if not text: continue
                
                # 1. Detectar cambio de TEMA
                if len(text) < 150:
                    match_header = re_tema_header_strict.search(text)
                    if not match_header:
                        match_header = re_tema_header_lax.search(text)

                    if match_header:
                        num_tema = match_header.group(1)
                        # Validar que sea un número de tema lógico (1-16)
                        if not (1 <= int(num_tema) <= 16):
                            continue

                        raw_title = match_header.group(2).strip() or ""
                        
                        # Limpieza del título
                        clean_title = re.sub(r'[|{}\[\],]', '', raw_title).strip()
                        if clean_title.startswith('.'): clean_title = clean_title[1:].strip()
                        if clean_title.startswith('°'): clean_title = clean_title[1:].strip()
                        
                        titulo_tema = clean_title if len(clean_title) > 4 else ""

                        # Asignar nombre bonito si es posible
                        if num_tema == "1": titulo_tema = "Constitución"

                        current_tema = f"Tema {num_tema}"
                        if titulo_tema: current_tema += f": {titulo_tema}"
                        
                        print(f"📑 Detectado ({current_tema}) en: {text[:50]}...")
                        continue

                # 2. Detectar PREGUNTA
                match_preg = re_inicio_pregunta.match(text)
                if match_preg:
                    # Validar que no sea un falso positivo (ej: numero de pagina)
                    # Si es solo numero, asumimos que es pregunta SOLO si ya estamos en un bloque de preguntas
                    # Pero en scraping simple, asumimos OK.
                    p_text = match_preg.group(2)
                    p_text = p_text.strip() if p_text else ""
                    
                    if current_pregunta: preguntas.append(current_pregunta)

                    current_pregunta = {
                        "id": len(preguntas) + 1,
                        "tema": current_tema,
                        "pregunta": p_text,
                        "opciones": {},
                        "correcta": "a", 
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
                        if current_pregunta["opciones"]:
                            last_key = list(current_pregunta["opciones"].keys())[-1]
                            current_pregunta["opciones"][last_key] += " " + text
                        else:
                            current_pregunta["pregunta"] += " " + text

        if current_pregunta:
            preguntas.append(current_pregunta)

        # Filtrado final: Relaxed
        preguntas_limpias = []
        for p in preguntas:
            # Filtro muy laxo: debe tener al menos algo de texto
            if len(p['pregunta']) > 5:
                preguntas_limpias.append(p)
        
        print(f"✅ Total preguntas crudas: {len(preguntas)}")
        print(f"✅ Total preguntas limpias: {len(preguntas_limpias)}")

        import os
        os.makedirs('data', exist_ok=True)
        with open('data/preguntas.json', 'w', encoding='utf-8') as f:
            json.dump(preguntas_limpias, f, ensure_ascii=False, indent=2)
            print(f"💾 Guardado en data/preguntas.json")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    extractor_final('pinche test mad CM.docx')