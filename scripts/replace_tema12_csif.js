const fs = require('fs');

const path = 'c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json';
let qs = JSON.parse(fs.readFileSync(path, 'utf8'));

// Remove all existing CSIF Tema 12 questions
qs = qs.filter(q => !(q.origen === 'CSIF' && q.tema && q.tema.includes('Tema 12:')));

console.log(`Questions remaining after removal: ${qs.length}`);

const tema12Questions = [
  {
    id: "csif_tema12_bUnico_1",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La aplicación del sistema análisis de peligros y puntos de control crítico (APPCC) permite. Señala la respuesta incorrecta.",
    opciones: {
      a: "Conseguir una mayor garantía de salubridad de los alimentos consumidos.",
      b: "Una utilización más eficaz de los recursos técnicos y económicos disponibles.",
      c: "Obliga a mantener una documentación específica que evidencie el control de los procesos.",
      d: "No se aplica este sistema de análisis de peligros y puntos de control crítico (APPCC) en las cocinas hospitalarias."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_2",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La vigilancia consiste en comprobar si el procedimiento de limpieza aplicado se realiza dentro de los límites críticos establecidos y por lo tanto bajo control. Las mediciones que se realicen se anotaran en registros. Dentro de los posibles métodos de vigilancia se recomienda:",
    opciones: {
      a: "Comprobación de pH de agua de aclarados.",
      b: "Métodos de detección de hormonas y/o ADN.",
      c: "La a y b son correctas.",
      d: "Ninguna es correcta."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_3",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Cuál de los siguientes no es principio del APPCC?",
    opciones: {
      a: "Detectar cualquier peligro que deba evitarse, eliminarse o reducirse a niveles aceptables.",
      b: "Detectar los puntos de control crítico en la fase o fases en la que el control sea esencial para evitar o eliminar un peligro o reducirlo a niveles aceptables.",
      c: "Establecer y aplicar procedimientos de vigilancia efectivos en los puntos de control crítico.",
      d: "Establecer medidas correctivas cuando la vigilancia indique que un punto de control crítico no está desviado."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_4",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Los sistemas de gestión de calidad en los hospitales:",
    opciones: {
      a: "Representan una mejora continua de una manera ordenada y sistemática.",
      b: "Son un conjunto de normas que establece el hospital bajo su criterio y necesidades.",
      c: "Todos los sistemas tienen que ser propuestos por la junta de personal.",
      d: "Ninguna de las anteriores es correcta."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_5",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema APPCC está basado en:",
    opciones: {
      a: "2 principios.",
      b: "7 principios.",
      c: "5 principios.",
      d: "2 principios básicos."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_6",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La trazabilidad es:",
    opciones: {
      a: "La detección de animales indeseables en la cocina.",
      b: "Un programa especial de limpieza y desinfección.",
      c: "La posibilidad de encontrar y seguir el rastro a través de todas las etapas de producción, transformación y distribución del alimento.",
      d: "Todas son correctas."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_7",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Para la seguridad alimentaria el sistema de autocontrol:",
    opciones: {
      a: "Permitirá el registro de las operaciones y controles realizados en la empresa.",
      b: "Estará adaptado a cada empresa.",
      c: "El objetivo será adoptar medidas preventivas y mantener bajo control los peligros de los alimentos que puedan afectar a la salud del consumidor.",
      d: "Todas son correctas."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_8",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es trazabilidad de un producto?",
    opciones: {
      a: "Establecer correspondencias entre el origen del alimento, su procesado y su distribución.",
      b: "Examen de calibraciones realizadas a equipos.",
      c: "Examen de los resultados contrastados de mantenimiento de equipos.",
      d: "No habrá registro de entrada de suministros y proveedores."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_9",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "De acuerdo al reglamento (CE) N° 852/2004 del parlamento europeo y del consejo, de 29 de abril de 2004, relativo a la higiene de los productos alimenticios, ¿Cuál de las siguientes afirmaciones relacionadas con los sistemas de análisis de peligros y puntos de control critico no es cierta?",
    opciones: {
      a: "Es un instrumento para ayudar a los operadores de empresa alimentaria a la consecución de un nivel más elevado de calidad en los alimentos y de autorregulación.",
      b: "Requieren el compromiso, cooperación y formación de los empleados.",
      c: "Sirven de base para el control oficial.",
      d: "Deben ser suficientemente flexibles para poder aplicarse en todas las situaciones, incluido en las empresas pequeñas."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_10",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La trazabilidad:",
    opciones: {
      a: "Es necesaria para controlar la rotación de los productos almacenados y así evitar las caducidades.",
      b: "Es un requisito fundamental que deben cumplir todos los alimentos producidos, transformados o distribuidos por un establecimiento de comidas preparadas.",
      c: "Es la posibilidad de encontrar y seguir el rastro a un alimento a través de todas las etapas de producción, transformación y distribución.",
      d: "Es un control obligatorio solo para los alimentos producidos en la unión europea."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_11",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Cuántos son los principios que componen un sistema APPCC (Análisis de peligros y puntos de control crítico)?",
    opciones: {
      a: "7 principios.",
      b: "12 principios.",
      c: "4 principios.",
      d: "10 principios."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_12",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "En el plan de mantenimientos de un APPCC se requieren equipos de medida en:",
    opciones: {
      a: "Mantenimiento de equipos de lavado automático.",
      b: "Mantenimiento de elementos de iluminación.",
      c: "Mantenimiento de suelos, paredes y techos.",
      d: "Mantenimiento de equipos de picado, loncheado y troceado."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_13",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Cuando se preparan programas de limpieza por escrito se deberá especificar:",
    opciones: {
      a: "Superficies, elementos del equipo y utensilios que ha de limpiarse.",
      b: "Responsabilidad de tareas particulares y medidas de vigilancia.",
      c: "Métodos y frecuencia de la limpieza.",
      d: "Las opciones A, B y C son correctas."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_14",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Según la norma de calidad ISO, el pensamiento basado en riesgos permite a una organización:",
    opciones: {
      a: "Realizar encuestas a los clientes para que propongan soluciones a posibles factores de riesgos.",
      b: "Hacer simulaciones de procesos de trabajo que puedan resultar un riesgo para los trabajadores.",
      c: "Determinar los factores que puedan desviar los resultados planificados en su sistema de gestión de calidad.",
      d: "Aceptar el principio de que todo proceso tienen un riesgo si se quiere obtener beneficio."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_15",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La norma internacional que define los requisitos que den cumplir un sistema de gestión de seguridad alimentaria para asegurar la inocuidad de los alimentos es:",
    opciones: {
      a: "ISO 22000:2018",
      b: "ISO 14001:2015",
      c: "El plan estratégico aprobado por la dirección de cada centro hospitalario.",
      d: "Las resoluciones que dicta la dirección general de salud pública de la consejería de sanidad."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_16",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Cuál de los siguientes principios APPCC es INCORRECTO?",
    opciones: {
      a: "Detectar cualquier riesgo que deba evitarse, eliminarse o reducirse a niveles aceptables.",
      b: "Establecer y aplicar procedimientos de vigilancia efectivos en los puntos de control crítico.",
      c: "Establecer medidas correctivas cuando la vigilancia indique que un punto de control crítico no está controlado.",
      d: "Detectar los puntos de control crítico en la fase o fases en las que el control sea esencial para evitar o eliminar un peligro o reducirlo a niveles aceptables."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_17",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es la trazabilidad?",
    opciones: {
      a: "Un prerrequisito para la detección de animales indeseables en cocina.",
      b: "Un prerrequisito de limpieza y desinfección de mis instalaciones.",
      c: "Una técnica culinaria.",
      d: "Un prerrequisito que me permite rastrear un producto a lo largo de mi sistema de producción."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_18",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Dentro del concepto de Trazabilidad se pueden diferenciar:",
    opciones: {
      a: "Trazabilidad hacia atrás.",
      b: "Trazabilidad interna.",
      c: "Trazabilidad hacia adelante.",
      d: "A, B y C son correctas."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_19",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Cuál de estos no es un principio que permite elaborar y mantener un plan APPCC?",
    opciones: {
      a: "Realizar un análisis de peligros.",
      b: "Identificar los peligros críticos del proceso.",
      c: "No establecer los límites críticos que deberán alcanzarse para asegurar que el PCC está bajo control.",
      d: "Establecer un sistema eficaz de registro de datos que documente la APPCC."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_20",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema APPCC es un método:",
    opciones: {
      a: "De almacenamiento.",
      b: "De designación de miembros del equipo culinario.",
      c: "Preventivo.",
      d: "Rehabilitador."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_21",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Según el Reglamento (CE) N° 852/2004 del Parlamento Europeo y del Consejo, de 29 de abril de 2004, relativo a la higiene de los productos alimenticios, uno de los principios del sistema de análisis de peligros y puntos de control crítico APPCC, es:",
    opciones: {
      a: "Pasar por alto los puntos de control crítico, cuando ese control sea esencial.",
      b: "Detectar cualquier peligro que deba evitarse, eliminarse o reducirse a niveles aceptables.",
      c: "Evitar establecer medidas correctoras.",
      d: "Obviar procedimientos de vigilancia efectivos en los puntos de control críticos."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_22",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Cómo se denomina el sistema que permite la identificación y control de todo el proceso que ha recorrido un producto desde el origen hasta el consumo?",
    opciones: {
      a: "Identificación activa.",
      b: "Planificación.",
      c: "Trazabilidad.",
      d: "Consecución."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_23",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "En los sistemas APPCC (análisis de peligros y puntos críticos de control) se usa una terminología específica. El diagrama de flujo es:",
    opciones: {
      a: "El control de un producto en todas las etapas de producción, transformación y distribución",
      b: "La secuencia detallada de las etapas o fases del proceso que afecten a un producto en cada una de las actividades, que van desde el sector primario hasta el consumidor final",
      c: "El examen metódico e independiente que se realiza para determinar si las actividades realizadas y los resultados obtenidos cumplen las disposiciones previamente establecidas",
      d: "Cualquier punto, procedimiento, operación o etapa de la cadena alimentaria, incluidas las materias primas, desde la producción primaria hasta el consumo final"
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_24",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Según el Sistema de APPCC ¿cuál de los siguientes corresponde al principio 2?",
    opciones: {
      a: "Establecer un procedimiento para comprobar que el sistema APPCC funciona de forma eficaz.",
      b: "Establecer un sistema de vigilancia y control sobre los Puntos Críticos de Control.",
      c: "Realizar un análisis de peligros.",
      d: "Identificar los Puntos Críticos de Control."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_25",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es la trazabilidad de un alimento?",
    opciones: {
      a: "El examen metódico e independiente en la industria alimentaria.",
      b: "Las medidas y condiciones necesarias para controlar los peligros.",
      c: "La posibilidad de seguir el rastro en todas las etapas del alimento.",
      d: "La elaboración de fichas de almacenamiento de productos."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_26",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Según el Sistema de APPCC ¿cuál de los siguientes corresponde al principio 4?",
    opciones: {
      a: "Establecer un procedimiento para comprobar que el sistema APPCC funciona de forma eficaz.",
      b: "Establecer un sistema de vigilancia y control sobre los Puntos Críticos de Control.",
      c: "Realizar un análisis de peligros.",
      d: "Identificar los Puntos Críticos de Control."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_27",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué requisitos no son necesarios para la correcta implantación del plan de análisis de peligros y puntos de control críticos (APPCC)?",
    opciones: {
      a: "Un plan de formación de manipulador de alimentos",
      b: "Un manual de buenas prácticas de higiene en la manipulación",
      c: "Un programa de limpieza, desinsectación y desratización (I+DD)",
      d: "Una cocina que carezca de condiciones estructurales adecuadas y de un plan de mantenimiento"
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_28",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La posibilidad de seguir la pista a un alimento a través de toda la cadena alimentaria (producción, transformación, distribución y consumo) gracias a un sistema de identificación y control, se denomina:",
    opciones: {
      a: "Trazabilidad",
      b: "Riesgo",
      c: "Medidas preventivas",
      d: "Todas son correctas"
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_29",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Se define trazabilidad como:",
    opciones: {
      a: "La posibilidad de seguir el rastro exclusivamente de un alimento, nunca de otros elementos a través de la etapa de distribución",
      b: "La posibilidad de seguir el rastro de un alimento o de una sustancia destinada a ser incorporada en alimentos o con probabilidad de serlo, a través de todas las etapas de producción, transformación y distribución",
      c: "La posibilidad de seguir el rastro de un alimento o de una sustancia destinada a ser incorporada en alimentos o con probabilidad de serlo, a través de la etapa de distribución",
      d: "La posibilidad de seguir el rastro exclusivamente de un alimento, a través de las etapas de producción, transformación y distribución."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_30",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Cual de los siguientes no es un principio del APPCC:",
    opciones: {
      a: "Detectar cualquier peligro que deba evitarse, eliminarse o reducirse a niveles aceptables",
      b: "Detectar los puntos de control critico en la fase o fases en las que el control sea esencial para evitar o eliminar un peligro o reducirlo a niveles aceptables",
      c: "Establecer y aplicar procedimientos de vigilancia efectivos en los puntos de control crítico",
      d: "Establecer medidas correctivas cuando la vigilancia Indique que un punto de control crítico no está desviado."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_31",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Las guías de prácticas correctas son un instrumento valioso para ayudar a los operadores de empresa alimentaria en todos los niveles de la cadena alimentaria a cumplir las normas sobre higiene de los alimentos y a aplicar los principios de:",
    opciones: {
      a: "DDD.",
      b: "HC.",
      c: "APPCC.",
      d: "IPC."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_32",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Es un principio del APPCC...:",
    opciones: {
      a: "Aplicación, Presupuestos Previstos, Control de Contratas.",
      b: "Detectar cualquier peligro que deba evitarse, eliminarse o reducirse a niveles aceptables.",
      c: "Limpieza, aplicación del DDD y Seguridad e Higiene en el trabajo.",
      d: "Asegurar la cadena de mando."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_33",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema de APPCC es un instrumento para ayudar a los operadores de empresa alimentaria a lograr un nivel más elevado:",
    opciones: {
      a: "De limpieza.",
      b: "De Seguridad Alimentaria.",
      c: "De aceptación por el usuario.",
      d: "De aceptación por la empresa adjudicataria."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_34",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema de APPCC no debe considerarse un método de autorregulación ni debe sustituir:",
    opciones: {
      a: "a la limpieza.",
      b: "a los controles de medicina preventiva.",
      c: "los controles oficiales",
      d: "a los controles del DDD."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_35",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Los requisitos relativos al APPCC deben tener en cuenta los principios incluidos en:",
    opciones: {
      a: "El Reglamento del Cabildo.",
      b: "El Codex Alimentarius.",
      c: "Las Ordenanzas Municipales.",
      d: "Las leyes nacionales."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_36",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué determina el límite crítico?",
    opciones: {
      a: "La frontera entre una comida segura y una no segura",
      b: "El valor mínimo que debe alcanzar cualquier parámetro",
      c: "La línea que marca el nivel de productividad",
      d: "El punto de la producción donde puede haber riesgo"
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_37",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Como define \"trazabilidad\" el reglamento 178/2002 de seguridad alimentaria:",
    opciones: {
      a: "La posibilidad de encontrar y seguir el rastro, a través de todas las etapas de producción, transformación y distribución, de un alimento, un pienso, un animal destinado a la producción de alimentos o una sustancia destinados a ser incorporados en alimentos o piensos o con probabilidad de serlo.",
      b: "El proceso consistente en sopesar las alternativas, teniendo en cuenta la determinación del riesgo de los alimentos y otros factores.",
      c: "El seguimiento de los alimentos en una cocina hospitalaria.",
      d: "Todas las respuestas son correctas."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_38",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema de análisis de peligros y puntos de control críticos (APPCC):",
    opciones: {
      a: "No requiere ningún procedimiento para su buen funcionamiento.",
      b: "Es el medio más eficaz para alcanzar y mantener un elevado nivel de seguridad alimentaria.",
      c: "Es una forma de organización de la cocina hospitalaria.",
      d: "Ninguna es correcta."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_39",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Un punto de control crítico (PCC) es:",
    opciones: {
      a: "Un punto, etapa o procesos, en el que puede aplicarse un control, que es esencial para prevenir o eliminar un peligro relacionado con la inocuidad de los alimentos o para reducirlo a un nivel aceptable.",
      b: "La posibilidad de aparición de un peligro.",
      c: "Ninguna respuesta es correcta.",
      d: "Una etapa del manual de buenas prácticas higiénicas."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_40",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Cual es la definición de ISO 22000:2018",
    opciones: {
      a: "Es un sistema para no gestión la calidad.",
      b: "Es una guía de buenas prácticas.",
      c: "Es una norma de sistemas de gestión de seguridad alimentaria.",
      d: "Es un sistema de APPCC."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_41",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Que entendemos por riesgo en el sistema de APPCC:",
    opciones: {
      a: "Probabilidad de aparición de un peligro.",
      b: "Etapa o proceso en el cual se puede realizar un control.",
      c: "Situación que se da cuando un límite critico es incumplido.",
      d: "Criterio que separa lo aceptable de lo inaceptable."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_42",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "El sistema de análisis de peligros y puntos de control crítico (APPCC) tiene como objetivo:",
    opciones: {
      a: "Establecer un plan de emergencia para el caso de incendio.",
      b: "Identificar, valorar y controlar los peligros sanitarios e higiénicos asociados al conjunto y a cada una de las fases de la cadena alimentaria.",
      c: "Analizar las pautas de comportamiento de los trabajadores.",
      d: "Ninguna de las anteriores respuestas es correcta."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_43",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La aplicación del sistema análisis de peligros y puntos de control crítico (APPCC) permite. Señala la respuesta incorrecta.",
    opciones: {
      a: "Conseguir una mayor garantía de salubridad de los alimentos consumidos.",
      b: "Una utilización más eficaz de los recursos técnicos y económicos disponibles.",
      c: "Obliga a mantener una documentación específica que evidencie el control de los procesos.",
      d: "No se aplica este sistema de análisis de peligros y puntos de control crítico (APPCC) en las cocinas hospitalarias."
    },
    correcta: "d",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_44",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Las siglas APPCC, significan:",
    opciones: {
      a: "Análisis de peligros y puntos de control críticos",
      b: "Análisis de posibles peligros y correcciones científicas",
      c: "Análisis de peligros puntuales y cambios concreto",
      d: "Análisis pocos puntos críticos."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_45",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué objetivo tiene la trazabilidad?",
    opciones: {
      a: "Evitar la existencia de cualquier plaga en las empresas alimentarias",
      b: "Garantizar la posibilidad de seguir el rastro de un alimento, a través de todas las etapas de su producción y distribución",
      c: "Garantizar que todos los manipuladores de alimentos disponen de una formación adecuada en higiene de los alimentos de acuerdo con su actividad laboral, y que se aplican los conocimientos adquiridos",
      d: "Asegurar que los suministros no incorporen peligros significativos que se mantengan en el alimento, tras el procesado efectuado por la empresa alimentaria."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_46",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "La cocina hospitalaria trabaja con un Sistema de Análisis de Peligros y Puntos Críticos de Control que se conocen por las siglas:",
    opciones: {
      a: "APC",
      b: "AAPCC",
      c: "APPCC",
      d: "AAPPC."
    },
    correcta: "c",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_47",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es el Equipo APPCC?",
    opciones: {
      a: "Equipo multidisciplinar de personas responsables de la elaboración del Plan APPCC",
      b: "Equipo de pinches que elaboran el Plan APPCC",
      c: "Equipo de cocineros que elaborar el Plan APPCC",
      d: "Equipo multidisciplinar que exclusivamente controla el Plan APPCC."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_48",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es el sistema APPCC?",
    opciones: {
      a: "Un instrumento para ayudar a lograr niveles elevados de seguridad alimentaria",
      b: "Un sistema de control de personal",
      c: "Un método para definir los procesos de producción",
      d: "Una guía de buenas prácticas."
    },
    correcta: "a",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_49",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "¿Qué es la TRAZABILIDAD de un alimento?",
    opciones: {
      a: "Conocer de quién es el producto.",
      b: "Poder rastrear un alimento desde su origen hasta que llega a manos del consumidor.",
      c: "Conocer la procedencia.",
      d: "Saber de qué nutrientes se compone."
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  },
  {
    id: "csif_tema12_bUnico_50",
    tema: "Tema 12: APPCC y Trazabilidad (Bloque Único)",
    pregunta: "Para seguir la pista a un alimento, cuando se elaboran los menús en la cocina hospitalaria, a través de toda la cadena alimentaria: producción, transformación, distribución y consumo, existe un sistema de identificación y control. ¿Cómo se denomina este sistema?",
    opciones: {
      a: "Seguimiento de cocina",
      b: "Trazabilidad",
      c: "Desinfección",
      d: "Ninguna es correcta"
    },
    correcta: "b",
    explicacion: "",
    origen: "CSIF"
  }
];

qs = qs.concat(tema12Questions);
fs.writeFileSync(path, JSON.stringify(qs, null, 2));
console.log(`Done! Total questions now: ${qs.length}`);
console.log(`Added ${tema12Questions.length} Tema 12 CSIF questions.`);
