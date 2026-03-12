import os
import json

FILES = [
    'manual_input.txt',
    'data/preguntas.json',
    'data/csif_questions.json',
    'data/sescam_2024_celador.json'
]

def detect_and_fix(filepath):
    if not os.path.exists(filepath):
        print(f"  ⚠️  No encontrado: {filepath}")
        return

    try:
        raw = open(filepath, 'rb').read()
        # Intentar UTF-8 primero
        try:
            text = raw.decode('utf-8')
            is_utf8 = True
        except UnicodeDecodeError:
            print(f"  ⚠️  {filepath}: No es UTF-8, probando Windows-1252...")
            try:
                text = raw.decode('cp1252')
            except:
                text = raw.decode('latin-1')
            is_utf8 = False

        original_text = text
        
        # Arreglo quirúrgico de Mojibake común
        replacements = {
            'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
            'Ã±': 'ñ', 'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó',
            'Ãš': 'Ú', 'Ã‘': 'Ñ', 'Â¿': '¿', 'Â¡': '¡', 'Âº': 'º',
            'Âª': 'ª', 'Ã¼': 'ü', 'Ãœ': 'Ü'
        }
        
        for bad, good in replacements.items():
            text = text.replace(bad, good)

        if text == original_text and is_utf8:
            print(f"  ✅ {filepath}: Ya está correcto.")
            return

        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        print(f"  ✅ {filepath}: ¡Corregido!")
    except Exception as e:
        print(f"  ❌ {filepath}: Error: {e}")

if __name__ == '__main__':
    print("=== Fix Encoding — Reparando Mojibake y convirtiendo a UTF-8 ===")
    for f in FILES:
        detect_and_fix(f)
    print("\n✅ Listo.")
