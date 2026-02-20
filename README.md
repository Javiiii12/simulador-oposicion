# 🍳 Simulador OPE Pinche - SESCAM (v1.13.x)

Bienvenido al **Simulador de Exámenes para Pinche de Cocina (SESCAM)**. Esta es una aplicación web avanzada diseñada para optimizar el estudio de las oposiciones, usando un enfoque de *Mobile-First* y diseño *Premium Sanidad*.

## ✨ Novedades Recientes (v1.13+)

*   **Estética "Sanatorio Teal"**: Un diseño renovado con colores institucionales (Teal/Mint médico), bordes de tarjeta redondeados, sombras dinámicas y degradados de cristal para una experiencia Premium.
*   **Diseño 100% Responsivo**: Layout optimizado para móviles (una columna elástica) y PC (dos columnas, rejilla *Grid*). Etiquetas flotantes informativas (*Pronto*, *Oficiales*, *Reales*).
*   **Gamificación de Estudio**: 
    *   Feedback verde/rojo instantáneo al pulsar las opciones.
    *   Mensajes motivacionales automáticos y variados en la pantalla de resultados (evaluando porcentajes ≥80%, entre 50-79%, y <50%).
    *   Barra dinámica superior indicando la progresión de la batería de test.
*   **Registros de Acceso Seguro (Admin)**: Capa de control de Logs de Acceso implementada con **Supabase** para realizar un seguimiento a prueba de manipulaciones de las conexiones al simulador usando cifrado SHA-256 local.

## 🚀 Organización del Temario

El simulador se divide en ramas estructurales que garantizan un abanico completo de repaso:
- **Fuentes de Estudio**: MAD (Oficiales), CSIF (Específicos), y Academia (Próximamente).
- **Separación de Partes**: Desglose intuitivo entre *Parte General* (Temas 1 a 6) y *Parte Específica* (Temas 7 a 16).
- **Exámenes Años Anteriores**: Pruebas íntegras reales (OPE 2020 SESCAM y de otras comunidades como SAS 2018, Murcia, Aragón).

## 🛠 Modos de Juego y Perfil

1. **🏋️‍♀️ Modo Normal**: Entrenamiento libre de la batería concreta seleccionada.
2. **🎲 Modo Aleatorio Global**: Construye un examen en tiempo real combinando *x* número de preguntas seleccionadas por el usuario al azar sumando de todas las fuentes disponibles.
3. **🧠 Repaso de Fallos**: Banco de preguntas donde se guardan exclusivamente aquellas en las que el usuario ha errado históricamente para asentar conocimientos peliagudos.

---

## 💻 Arquitectura para Desarrolladores

La aplicación está construida sobre tecnologías Web puras, alojada en GitHub Pages y con microservicios.

- `index.html`: Punto de entrada (Single Page Application). Usa capas `div` dinámicas para la navegación en lugar de múltiples archivos HTML.
- `css/style.css`: Controla toda la temática Premium Teal usando variables globales y Media Queries. Carga optimizada con *caché buster* (`?v=5.0`).
- `js/script.js`: Motor del simulador. Almacena en `localStorage` el progreso y renderiza los tests mediante iteraciones sobre los fragmentos JSON.
- `data/preguntas.json`: Corazón de los datos. Se divide por ramas, permitiendo añadir temas estructurados por años o fuentes casi ilimitadamente.

---
*Desarrollado con ❤️ y código limpio para dar el salto la codiciada plaza blanca.*
