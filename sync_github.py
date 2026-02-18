import os
import subprocess
import time

def run_git_commands():
    print("🚀 Iniciando Sincronización con GitHub...")
    
    # Comandos a ejecutar
    commands = [
        ["git", "add", "."],
        ["git", "commit", "-m", "Actualización de test masiva (Auto-Sync)"],
        ["git", "push"]
    ]
    
    for cmd in commands:
        print(f"Ejecutando: {' '.join(cmd)}")
        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"❌ Error en comando: {e}")
            print(e.stderr)
            # Si el error es "nothing to commit", seguimos
            if "nothing to commit" in e.stderr or "clean" in e.stdout:
                continue
            return False
            
    print("✅ Sincronización completada con éxito.")
    return True

if __name__ == "__main__":
    # Opcional: Ejecutar primero la extracción si se desea
    # os.system("python extraer_test.py") 
    run_git_commands()
