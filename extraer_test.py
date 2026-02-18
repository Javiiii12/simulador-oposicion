import sys
import os

# 1. Intentar importar la librería
try:
    import docx
    print("✅ Librería docx cargada correctamente.")
except ImportError:
    print("❌ ERROR: No está instalada la librería 'python-docx'.")
    print("👉 Ejecuta en la terminal: pip install python-docx")
    sys.exit()

def diagnostico_word(file_path):
    # 2. Verificar si el archivo existe
    if not os.path.exists(file_path):
        print(f"❌ ERROR: No encuentro el archivo '{file_path}'.")
        print(f"Archivos en esta carpeta: {os.listdir('.')}")
        return

    try:
        print(f"📂 Abriendo {file_path}...")
        doc = docx.Document(file_path)
        
        # 3. Leer solo los primeros párrafos para ver qué hay
        print("📝 --- MUESTRA DE TEXTO ENCONTRADO ---")
        texto_muestra = ""
        for i, p in enumerate(doc.paragraphs[:15]): # Solo los primeros 15 párrafos
            if p.text.strip():
                print(f"Línea {i}: {p.text}")
                texto_muestra += p.text + "\n"
        print("---------------------------------------")
        
        if not texto_muestra:
            print("⚠️ ATENCIÓN: El Word parece estar vacío o el texto está dentro de imágenes.")
        else:
            print("🚀 El archivo tiene texto. El problema es la 'fórmula' de extracción.")

    except Exception as e:
        print(f"🔥 ERROR CRÍTICO AL LEER: {e}")

# Cambia el nombre si el tuyo es diferente (ojo a los espacios)
nombre_fichero = 'pinche test mad CM.docx'
diagnostico_word(nombre_fichero)