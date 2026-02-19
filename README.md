# 🍳 Simulador OPE Pinche - SESCAM

Bienvenido al **Simulador de Exámenes para Pinche de Cocina (SESCAM)**. Esta es una aplicación web diseñada para ayudar a los opositores a practicar y estudiar de manera interactiva.

## 🚀 Características Principales

### 1. Modos de Estudio
- **🏋️‍♀️ Entrenamiento**: Ideal para estudiar. Responde a las preguntas y obtén **feedback inmediato** (verde/rojo) con la explicación de la respuesta correcta.
- **⏱ Simulacro Examen**: Simula un examen real. Responde todas las preguntas sin saber si has acertado o fallado. Al final, obtendrás tu nota y podrás revisar tus fallos.

### 2. Gestión de Progreso
- **📊 Mi Historial**: La aplicación guarda automáticamente tus resultados (fecha, tema y nota) en tu navegador para que puedas ver tu evolución.
- **🧠 Repaso de Fallos**: Las preguntas que falles se guardan en una lista especial (badge rojo). Usa el botón "Repasar Fallos" para volver a intentarlas hasta que las aciertes.

### 3. Organización por Temas
- **Temas MAD**: Preguntas organizadas según el temario oficial (Constitución, Estatuto, Seguridad Alimentaria, Cocina, etc.).
- **Exámenes Oficiales**: (En construcción) Recopilación de exámenes reales de años anteriores.

---

## 📂 Estructura del Proyecto

La aplicación es una web estática (HTML/CSS/JS) que no requiere servidor backend (funciona directamente en el navegador).

- `index.html`: La página principal y única (SPA - Single Page Application).
- `css/style.css`: Estilos visuales, diseño responsive y tema "premium".
- `js/script.js`: Toda la lógica de la aplicación (navegación, corrección, guardado de datos).
- `data/preguntas.json`: Base de datos de preguntas en formato JSON.
- `scripts/`: Herramientas en Python para gestión de datos (no necesarias para jugar).
    - `ingest_manual.py`: Script para añadir nuevas preguntas desde texto.
    - `limpiar_datos.py`: Script para limpiar y validar el JSON.

---

## 🛠 Cómo usar (Para Desarrolladores / Mantenimiento)

### Añadir Nuevas Preguntas
1.  Abre `manual_input.txt` (si existe) o crea un archivo de texto con el formato:
    ```text
    1. ¿Pregunta?
    a) Opción A
    b) Opción B
    c) Opción C
    d) Opción D
    Solución: b
    ```
2.  Ejecuta el script de ingesta:
    ```bash
    python scripts/ingest_manual.py
    ```
3.  Esto actualizará automáticamente `data/preguntas.json`.

### Despliegue
Simplemente sube los cambios a GitHub. La web está alojada en **GitHub Pages**.

---

## 📝 Notas
- La aplicación usa `localStorage` para guardar el progreso. Si borras la caché del navegador, perderás tu historial.
- No se envían datos a ningún servidor externo. ¡Tu privacidad está asegurada!

---
*Desarrollado con ❤️ para opositores.*
