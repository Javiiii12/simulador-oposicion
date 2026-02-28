# 🍳 Simulador OPE Pinche - SESCAM (v1.13.x)

Aplicación web avanzada para preparar las oposiciones de **Pinche de Cocina (SESCAM)**. Diseño *Mobile-First* con estética *Premium Sanidad Teal*.

---

## ✨ Características Principales

- **Estética "Sanatorio Teal"**: colores institucionales, glassmorphism, sombras dinámicas.
- **100% Responsivo**: una columna en móvil, rejilla en PC.
- **Gamificación**: feedback verde/rojo instantáneo, mensajes motivacionales, barra de progreso.
- **Modos de juego**: Entrenamiento, Examen (con penalización -1/3), Repaso de Fallos, Revisión.
- **Aleatorio global**: combina preguntas de todas las fuentes con filtros por origen, examen oficial o tema concreto.
- **Historial de fallos persistente**: se guarda en `localStorage` entre sesiones.
- **Acceso seguro**: control de licencias, logs de acceso con encriptación SHA-256.

---

## 📚 Fuentes de Preguntas

| Fuente | Descripción |
|--------|-------------|
| **MAD** | Temario oficial editado (preguntas clásicas) |
| **CSIF** | Banco de preguntas sindicales |
| **Academia** | Preguntas desglosadas por tema (ver tabla abajo) |
| **Exámenes** | OPE SESCAM 2020 (ordinario y extraordinario), CCAA, Histórico |

---

## 📋 Temario Academia — Estado Actual

### PARTE GENERAL (Temas 1–6)

| Tema | Título | Estado |
|------|--------|--------|
| Tema 1 | La Constitución Española de 1978 | ✅ |
| Tema 2 | Estatuto de Autonomía de CLM | ✅ |
| Tema 3 | Ley General de Sanidad y SESCAM | ✅ |
| Tema 4 | Ley de Ordenación Sanitaria de CLM | ✅ |
| Tema 5 | Estatuto Marco del Personal Estatutario | ✅ |
| Tema 6 | Régimen Jurídico del Personal Estatutario | 🔜 |

### PARTE ESPECÍFICA (Temas 7–16)

| Tema | Título | Estado |
|------|--------|--------|
| Tema 7 | Plan de autoprotección y prevención de incendios | 🔜 |
| Tema 8 | Ley de Prevención de Riesgos Laborales | ✅ (83 prev.) |
| Tema 9 | La Atención Primaria de Salud | ✅ (60 prev.) |
| Tema 10 | La Asistencia Especializada | ✅ (65 prev.) |
| Tema 11–16 | Cocina, Alimentación, APPCC… | 🔜 |

---

## 🛠 Modos de Juego

| Modo | Descripción |
|------|-------------|
| 🏋️ **Entrenamiento** | Feedback inmediato en cada pregunta. Sin penalización. |
| 📝 **Examen** | Sin feedback hasta el final. Penalización oficial: -1/3 por error. |
| ❌ **Repaso de Fallos** | Banco de preguntas falladas históricamente. |
| 🔄 **Revisión** | Repaso de un test completado (con o sin filtro de fallos). |
| 🎲 **Aleatorio** | Selecciona N preguntas de toda la base o filtradas por tema/origen. |

*Desarrollado con ❤️ y código limpio para dar el salto a la codiciada plaza blanca.*
