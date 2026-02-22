"""
fix_encoding.py
Detecta y convierte los archivos JSON de preguntas a UTF-8 sin BOM.
Ejecuta DESDE la raíz del proyecto: python fix_encoding.py
"""
import json
import os

FILES = [
    'data/preguntas.json',
    'data/csif_questions.json',
]

def detect_and_fix(filepath):
    if not os.path.exists(filepath):
        print(f"  ⚠️  No encontrado: {filepath}")
        return

    raw = open(filepath, 'rb').read()
    size_before = len(raw)

    # Detectar codificación por BOM
    if raw[:3] == b'\xef\xbb\xbf':
        encoding = 'utf-8-sig'
        bom_type = 'UTF-8 con BOM'
    elif raw[:2] == b'\xff\xfe':
        encoding = 'utf-16'
        bom_type = 'UTF-16 LE'
    elif raw[:2] == b'\xfe\xff':
        encoding = 'utf-16'
        bom_type = 'UTF-16 BE'
    else:
        encoding = 'utf-8'
        bom_type = 'UTF-8 (sin BOM detectado)'

    print(f"\n📄 {filepath}")
    print(f"   Codificación detectada : {bom_type}")
    print(f"   Tamaño original        : {size_before:,} bytes")

    # Leer y validar el JSON
    try:
        text = raw.decode(encoding)
        data = json.loads(text)
    except Exception as e:
        print(f"   ❌ Error al leer/parsear: {e}")
        return

    print(f"   ✅ JSON válido          : {len(data)} elementos")

    # Guardar de nuevo en UTF-8 sin BOM
    output = json.dumps(data, ensure_ascii=False, indent=2)
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(output)

    size_after = os.path.getsize(filepath)
    print(f"   💾 Guardado en UTF-8    : {size_after:,} bytes")

if __name__ == '__main__':
    print("=== Fix Encoding — Convirtiendo JSON a UTF-8 sin BOM ===")
    for f in FILES:
        detect_and_fix(f)
    print("\n✅ Listo. Haz commit y push de los archivos data/ modificados.")
