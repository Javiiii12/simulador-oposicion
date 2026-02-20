const fs = require('fs');

const dataRaw = fs.readFileSync('c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json', 'utf8');
let questions = JSON.parse(dataRaw);

// User's requested structure mappings
function remapTema(q) {
    const t = q.tema;
    let newTema = t;

    // TEMA 1
    if (t === "Tema 1: La Constitución (Bloque 2 - Constitución 1978)") {
        newTema = "Tema 1: La Constitución (Bloque 1: Constitución Española - CSIF)";
    } else if (t === "Tema 1: La Constitución (Bloque 1 - Igualdad CLM)") {
        newTema = "Tema 1: La Constitución (Bloque 2: Ley Orgánica 3/2007 - Igualdad Efectiva)";
    } else if (t === "Tema 1: La Constitución (Bloque 3 - Violencia Género)") {
        newTema = "Tema 1: La Constitución (Bloque 3: Ley Orgánica 1/2004 - Violencia de Género)";
    } else if (t === "Tema 1") {
        newTema = "Tema 1: La Constitución (Bloque 1: Constitución Española - MAD)";
    }

    // TEMA 2
    else if (t === "Tema 2: Estatuto y Transparencia (Bloque 1 - Estatuto)") {
        newTema = "Tema 2: Castilla-La Mancha (Bloque 1: Estatuto de Autonomía de CLM)";
    } else if (t === "Tema 2: Estatuto y Transparencia (Bloque 2 - Transparencia)") {
        newTema = "Tema 2: Castilla-La Mancha (Bloque 2: Ley de Transparencia y Buen Gobierno de CLM)";
    } else if (t === "Tema 2") {
        newTema = "Tema 2: Castilla-La Mancha (Bloque 1: Estatuto de Autonomía de CLM)"; // assuming non-CSIF Tema 2 is Estatuto.
    }

    // TEMA 3
    else if (t === "Tema 3" || t === "Tema 3: Ley General de Sanidad") {
        newTema = "Tema 3: Ley General de Sanidad";
    }

    return newTema;
}

questions = questions.map(q => {
    q.tema = remapTema(q);
    return q;
});

// Now parse Tema 4 raw text
const rawText = `Bloque 1: Ley 8/2000 de Ordenación Sanitaria de Castilla-La Mancha
1. ¿En relación con la salud ¿sobre qué materias tiene competencia la Administración del Estado? 
•	a) Las bases y la coordinación general de la sanidad y la legislación sobre productos farmacéuticos 
•	b) La Sanidad exterior y las relaciones y acuerdos sanitarios internacionales 
•	c) Las dos respuestas anteriores son correctas 
•	d) No hay respuestas correctas 
•	Respuesta Correcta: c 
2. Actualmente el Ministerio competente en materia de salud y asistencia sanitaria es: 
•	a) El Ministerio de Sanidad 
•	b) El Ministerio de Consumo y Bienestar Social 
•	c) El Ministerio de Salud Pública y Sanidad 
•	d) El Ministerio de Igualdad y Salud 
•	Respuesta Correcta: a 
3. Dentro de la Administración General del Estado ¿cuál es el órgano permanente de coordinación, cooperación, comunicación e información de los Servicios de Salud, entre ellos y con la Administración del Estado? 
•	a) El Ministerio de Sanidad 
•	b) El Consejo Interterritorial del Sistema Nacional de Salud 
•	c) El Secretario de Estado de Sanidad 
•	d) El Vicepresidente 2º del Gobierno 
•	Respuesta Correcta: b 
4. En la Administración General del Estado ¿cuál es el órgano administrativo que tiene como finalidad promover la cohesión del Sistema Nacional de Salud? 
•	a) El Ministerio de Sanidad 
•	b) El Secretario de Estado de Sanidad 
•	c) El Consejo de Ministros 
•	d) El Consejo Interterritorial del Sistema Nacional de Salud 
•	Respuesta Correcta: d 
5. Con arreglo al reparto constitucional de materias las Comunidades Autónomas NO tienen competencias en relación con: 
•	a) Planificación sanitaria 
•	b) La legislación sobre productos farmacéuticos 
•	c) Asistencia sanitaria. 
•	d) Planificación de salud pública 
•	Respuesta Correcta: b 
6. En el ámbito de Castilla-La Mancha, ¿qué órganos NO tienen competencia en materia de salud y asistencia sanitaria según la ley 8/2000? 
•	a) El Presidente del Consejo de Gobierno 
•	b) El Consejo de Gobierno 
•	c) La Consejería competente en materia de sanidad 
•	d) No hay respuestas correctas porque todos los citados tienen competencia en esas materias 
•	Respuesta Correcta: a 
7. Según la ley 8/2000, de 30 de noviembre, de Ordenación Sanitaria de Castilla-La Mancha, ¿quién tiene competencia para aprobar la delimitación geográfica de las Áreas de Salud y los municipios que las integran? 
•	a) Las Cortes de Castilla-La Mancha 
•	b) El Presidente del Consejo de Gobierno 
•	c) El titular de la Consejería competente en materia de sanidad 
•	d) El Consejo de Gobierno 
•	Respuesta Correcta: d 
8. Con arreglo a la ley 8/2000 ¿a quién le corresponde nombrar y cesar a la persona que ocupe la Dirección-Gerencia del Servicio de Salud de Castilla-La Mancha? 
•	a) A las Cortes de Castilla-La Mancha 
•	b) Al Consejo de Gobierno a propuesta del titular de la Consejería Sanidad. 
•	c) Al Presidente del Consejo de Gobierno a propuesta del titular de la Consejería Sanidad. 
•	d) Al Consejo de Gobierno a propuesta de su Presidente 
•	Respuesta Correcta: b 
9. Señala la respuesta INCORRECTA: En Castilla-La Mancha corresponde a la Consejería competente en materia de sanidad: 
•	a) Autorizar, catalogar y, en su caso, acreditar los centros, servicios y actividades sanitarias, así como el mantener los registros pertinentes. 
•	b) Nombrar a los vocales del Consejo de Salud de Castilla-La Mancha. 
•	c) Nombrar y cesar a la persona que ocupe la Dirección-Gerencia del Servicio de Salud de Castilla-La Mancha 
•	d) Cesar a los vocales del Consejo de Salud de Castilla-La Mancha. 
•	Respuesta Correcta: c 
10. De acuerdo con la ley 8/2000, ¿a quién corresponde en el ámbito territorial de cada provincia el desarrollo de las funciones y la prestación de los servicios de la Consejería responsable en materia de sanidad? 
•	a) Al Delegado de la Junta de Comunidades 
•	b) A las Delegaciones Provinciales 
•	c) Al Consejero de Sanidad 
•	d) Al Consejo de Gobierno 
•	Respuesta Correcta: b 
11. Conforme a la legislación actual ¿de quién es competencia que se cumpla lo establecido en las normas y planes sanitarios en relación con el control sanitario del medioambiente: contaminación atmosférica, abastecimiento de aguas, saneamiento de aguas residuales, residuos urbanos e industriales? 
•	a) De los Ayuntamientos 
•	b) De la Comunidad Autónoma 
•	c) De la Administración General del Estado 
•	d) De las Diputaciones Provinciales 
•	Respuesta Correcta: a 
12. Según la ley 8/2000, el Servicio de Salud de Castilla-La Mancha es: 
•	a) un Organismo Autónomo dotado de personalidad para poder cumplir sus fines 
•	b) un Organismo Autónomo dotado de personalidad jurídica propia y plena capacidad de obrar para el cumplimiento de sus fines. 
•	c) un órgano administrativo dependiente de las Cortes de CLM 
•	d) un órgano administrativo dependiente directamente del Ministerio de Sanidad 
•	Respuesta Correcta: b 
13. ¿A qué Consejería está adscrito el Servicio de Salud de Castilla-La Mancha? 
•	a) a la competente en materia de sanidad 
•	b) directamente al Consejo de Gobierno y no a una Consejería. 
•	c) como se trata de un organismo autónomo no figura adscrito a ningún otro órgano 
•	d) directamente a las Cortes de CLM 
•	Respuesta Correcta: a 
14. El Servicio de Salud de Castilla-La Mancha se estructura en: 
•	a) órganos centrales y órganos periféricos 
•	b) órganos centrales y órganos provinciales 
•	c) órganos provinciales y órganos estatales 
•	d) órganos municipales, provinciales y regionales 
•	Respuesta Correcta: a 
15. Según la ley 8/2000, son órganos centrales del SESCAM: 
•	a) El Consejo de Administración, la Presidencia del Consejo de Administración y la Dirección-Gerencia 
•	b) Las Gerencias de centros y servicios 
•	c) El Consejo de Administración, únicamente 
•	d) El Consejero de Sanidad 
•	Respuesta Correcta: a 
16. ¿Quién es competente para aprobar el reglamento de estructura y funcionamiento del Sescam según la ley 8/2000? 
•	a) Las Cortes regionales 
•	b) la Consejería competente en materia de sanidad 
•	c) el Presidente del Consejo de Gobierno 
•	d) el Consejo de Gobierno, a propuesta de la Consejería competente en materia de sanidad 
•	Respuesta Correcta: d 
17. ¿Cuál es el órgano superior de Gobierno y Administración del Servicio de Salud de Castilla-La Mancha? 
•	a) La Presidencia del Consejo de Administración 
•	b) El Consejo de Administración 
•	c) La Dirección-Gerencia del mismo 
•	d) El Consejero de Sanidad 
•	Respuesta Correcta: b 
18. Según la ley 8/2000 el Consejo de Administración del Sescam estará integrado, entre otros, por: 
•	a) 10 miembros en representación de las Corporaciones Locales, de las Organizaciones Sindicales y Empresariales más representativas de CLM, de las Asociaciones de Consumidores y Usuarios y de las Asociaciones de Vecinos. 
•	b) un número no superior a diez representantes de la Administración de la Comunidad Autónoma 
•	c) diez miembros y el Presidente del Consejo de Gobierno, que lo presidirá 
•	d) doce miembros y el Presidente de las Cortes de CLM, que lo presidirá 
•	Respuesta Correcta: a 
19. Conforme a la ley 8/2000 la pertenencia al Consejo de Administración del Sescam es incompatible con: 
•	a) ser juez o magistrado en el ámbito territorial de CLM 
•	b) el ejercicio de la Abogacía en el ámbito territorial de CLM 
•	c) el ejercicio de Procurador en los juzgados y tribunales de CLM 
•	d) cualquier vinculación con empresas o entidades relacionadas con el suministro o la dotación de material sanitario, productos farmacéuticos y otros intereses relacionados con la sanidad 
•	Respuesta Correcta: d 
20. ¿A quién corresponde, según la ley 8/2000, la dirección del organismo autónomo Sescam y de su Consejo de Administración, la convocatoria de éste, así como, la supervisión de todas las actuaciones del Servicio Regional? 
•	a) a la Dirección-Gerencia 
•	b) al Consejo de Administración 
•	c) a la persona que ocupe la Presidencia del Consejo de Administración 
•	d) al Secretario del Consejo de Administración 
•	Respuesta Correcta: c 
21. ¿Quién es el representante legal del Sescam que tiene atribuidas las funciones de: control, coordinación estratégica y gestión del Servicio, según la ley 8/2000? 
•	a) la persona que ocupe la Dirección-Gerencia del Servicio 
•	b) el Consejo de Administración 
•	c) la persona que ocupe la Presidencia del Consejo de Administración 
•	d) el Consejero competente en materia de sanidad 
•	Respuesta Correcta: a 
22. ¿A quién corresponde, según la ley 8/2000, el nombramiento y cese de la persona titular de la Dirección-Gerencia del Sescam? 
•	a) al Presidente del Consejo de Gobierno a propuesta del titular de la Consejería competente en materia de sanidad. 
•	b) a las Cortes regionales a propuesta del titular de la Consejería competente en materia de sanidad 
•	c) al Ministro de Sanidad 
•	d) al Consejo de Gobierno a propuesta del Titular de la Consejería competente en materia de sanidad. 
•	Respuesta Correcta: d 
23. ¿Cuáles son los órganos periféricos territoriales del Servicio de Salud de CLM a quienes corresponde optimizar la gestión de los servicios y dirigir los recursos y centros que se le asignen? 
•	a) Las Direcciones provinciales 
•	b) las Delegaciones de la Junta 
•	c) Las Gerencias 
•	d) La Dirección General de Asistencia Sanitaria y la Dirección General de Recursos Humanos 
•	Respuesta Correcta: c 
24. Las Gerencias actuarán, según la ley 8/2000, bajo los principios de: 
•	a) autonomía y desconcentración de la gestión. 
•	b) autonomía, eficacia y eficiencia 
•	c) autonomía y responsabilidad 
•	d) desconcentración y descentralización de la gestión 
•	Respuesta Correcta: a 
25. Las personas al cargo de las Gerencias serán designadas y cesadas, según la ley 8/2000: 
•	a) por quien esté al frente de la Consejería competente en materia de sanidad, de quien dependerán jerárquicamente. 
•	b) por quien esté al frente de la Dirección-Gerencia del Servicio, de quien dependerán jerárquicamente. 
•	c) por quien ostente la Presidencia del Consejo de Gobierno, de quien dependerán jerárquicamente 
•	d) por el Consejo de Gobierno, a propuesta del Consejero de Sanidad 
•	Respuesta Correcta: b 
26. De acuerdo con la ley 8/2000, ponen fin a la vía administrativa los actos administrativos dictados por: 
•	a) La Presidencia del Consejo de Administración. 
•	b) El Consejo de Administración. 
•	c) Por el Director Gerente pero solo en materia de personal y de contratación. 
•	d) Todas las respuestas son correctas 
•	Respuesta Correcta: d 
27. Conforme a la ley 8/2000 los actos y acuerdos de la persona a cargo de la Dirección-Gerencia del Servicio serán susceptibles de recurso ante: 
•	a) el Presidente del Consejo de gobierno 
•	b) el titular de la Consejería competente en materia de sanidad en todos los casos 
•	c) el titular de la Consejería competente en materia de sanidad excepto en materia de personal y contratación 
•	d) el Ministro de Sanidad 
•	Respuesta Correcta: c 
28. De acuerdo con la ley 8/2000 los actos y acuerdos de los gerentes asistenciales serán susceptibles de recurso ante: 
•	a) el Consejero de sanidad 
•	b) el Presidente del Consejo de gobierno 
•	c) el Ministro de Sanidad 
•	d) el Director Gerente del Servicio. 
•	Respuesta Correcta: d 
29. Según la ley 8/2000 la declaración de nulidad de los actos administrativos procedentes de los órganos del Sescam que hayan puesto fin a la vía administrativa corresponde: 
•	a) al Consejero de Sanidad en todos los casos 
•	b) al órgano que los dictó. 
•	c) al Consejo de Administración siempre 
•	d) al Presidente del Consejo de Administración 
•	Respuesta Correcta: b 
30. En el ámbito del Sescam la declaración de nulidad de los actos administrativos que no hayan sido recurridos en plazo y de las disposiciones administrativas corresponderá: 
•	a) a quien esté al cargo de la Dirección-Gerencia del Servicio de Salud. 
•	b) al Presidente del Consejo de Administración del Sescam 
•	c) al Consejero competente en materia de sanidad 
•	d) al Ministro de Sanidad 
•	Respuesta Correcta: a 
31. La declaración de lesividad de los actos anulables del Servicio de Salud de Castilla-La Mancha corresponderá: 
•	a) al titular de la Consejería competente en materia de sanidad. 
•	b) a quien esté al cargo de la Dirección-Gerencia del Servicio de Salud. 
•	c) al Presidente del Consejo de Administración del Sescam 
•	d) al Presidente del Consejo de Gobierno 
•	Respuesta Correcta: a 
32. ¿A quién corresponde la resolución de los expedientes de reclamación de responsabilidad patrimonial en el ámbito del Sescam según la ley 8/2000? 
•	a) a las Cortes regionales 
•	b) al Consejo de Gobierno 
•	c) al Presidente del Consejo de Gobierno 
•	d) al Director Gerente del Servicio de Salud de CLM 
•	Respuesta Correcta: d 
33. Señala la respuesta correcta: 
•	a) Las actuaciones del Servicio de Salud de CLM estarán sujetas al control de la Sindicatura de Cuentas de la Comunidad Autónoma. 
•	b) Las actuaciones del Servicio de Salud de CLM no estarán sujetas al control de la Sindicatura de Cuentas de la Comunidad Autónoma. 
•	c) Las actuaciones del Servicio de Salud de CLM estarán sujetas al control del Consejo Consultivo de CLM 
•	d) La ley dice que están sujetas al control de la Sindicatura de Cuentas, pero actualmente este organismo no existe 
•	Respuesta Correcta: d 
34. Según la ley 8/2000 el Servicio de Salud de CLM está sometido: 
•	a) al régimen de contabilidad del Derecho mercantil únicamente 
•	b) al régimen de contabilidad que aprueba el Consejo de Administración 
•	c) al régimen de contabilidad pública y rendirá sus cuentas de acuerdo con los principios y normas de ésta. 
•	d) al régimen de contabilidad del Derecho mercantil únicamente y de las normas sobre la materia de la Unión Europea 
•	Respuesta Correcta: c 
35. Aparte de la ley 8/2000, la norma que regula la estructura orgánica y las funciones del Servicio de Salud de Castilla-La Mancha es: 
•	a) no hay otra norma, solo la ley 8/2000 
•	b) la ley orgánica 3/2007 
•	c) el Real Decreto 166/2015, de 14 de julio 
•	d) el Decreto 82/2019, de 16 de julio 
•	Respuesta Correcta: d 
36. Dispone la norma que regula la estructura orgánica y las funciones del Servicio de Salud de Castilla-La Mancha que son órganos centrales del mismo, además del Consejo de Administración, la Presidencia y la Dirección-Gerencia: 
•	a) Las gerencias de ámbito regional. 
•	b) Las gerencias de atención integrada. 
•	c) Los órganos directivos dependientes de la Dirección-Gerencia que se relacionan en el mismo 
•	d) Las gerencias de atención especializada. 
•	Respuesta Correcta: c 
37. Establece la norma que regula la estructura orgánica y las funciones del Servicio de Salud de Castilla-La Mancha que son órganos periféricos del mismo: 
•	a) Las gerencias de ámbito regional. 
•	b) Las gerencias de atención interdisciplinar. 
•	c) Los órganos directivos dependientes de la Dirección-Gerencia que se relacionan en el mismo 
•	d) Los órganos directivos dependientes de la Dirección-Gerencia 
•	Respuesta Correcta: a 
38. La Dirección-Gerencia del Servicio de Salud de Castilla-La Mancha, según el Decreto regulador, tiene rango de: 
•	a) Consejería 
•	b) Viceconsejería 
•	c) Dirección General 
•	d) Subdirección General 
•	Respuesta Correcta: b 
39. ¿Cuál es el órgano unipersonal responsable de la gestión del Sescam? 
•	a) La Presidencia del Consejo de Administración 
•	b) El Consejero responsable en materia sanitaria 
•	c) El Presidente del Consejo de Gobierno 
•	d) La Dirección-Gerencia 
•	Respuesta Correcta: d 
40. ¿A quién corresponde el nombramiento y cese de la persona titular de la Dirección-Gerencia del Sescam? 
•	a) al Consejo de Gobierno a propuesta de la persona titular de la Consejería de Sanidad. 
•	b) al Presidente del Consejo de Gobierno a propuesta de la persona titular de la Consejería de Sanidad. 
•	c) al titular de la Consejería de Sanidad a propuesta del Consejo de Gobierno 
•	d) al Presidente de las Cortes de CLM 
•	Respuesta Correcta: a 
41. Bajo la superior dirección de la Dirección-Gerencia del Sescam ejercerán sus funciones, como órganos directivos: 
•	a) La Secretaría General, la Dirección General de Asistencia Sanitaria y la Dirección General de Recursos Humanos. 
•	b) La Secretaría General y la Dirección General de Asistencia Médica 
•	c) La Secretaría General, únicamente 
•	d) La Dirección General de Asuntos de epidemias 
•	Respuesta Correcta: a 
42. Las personas titulares de los órganos directivos dependientes de la Dirección-Gerencia del Sescam serán nombradas: 
•	a) por el Vicepresidente del Consejo de Gobierno. 
•	b) por el titular de la Consejería de Sanidad. 
•	c) por el Presidente del Consejo de Gobierno 
•	d) por el Consejo de Gobierno a propuesta de la persona titular de la Consejería de Sanidad. 
•	Respuesta Correcta: d 
43. ¿Cuáles son los órganos de dirección y gestión de los recursos, centros e instituciones que sean asignados por la Dirección-Gerencia del Sescam en su ámbito correspondiente? 
•	a) las direcciones provinciales 
•	b) las delegaciones provinciales 
•	c) las gerencias 
•	d) las Consejerías 
•	Respuesta Correcta: c 
44. Las gerencias del Sescam se crean, modifican y suprimen por: 
•	a) Orden de la Consejería competente en materia de asistencia sanitaria 
•	b) Decreto del Presidente del Consejo de Gobierno 
•	c) Decreto del Consejo de Gobierno 
•	d) Ley de las Cortes de CLM 
•	Respuesta Correcta: a 
45. La estructura de las gerencias podrá tener distinta configuración según el volumen de gestión derivada del número y naturaleza de los centros de gestión existentes en cada uno de los ámbitos territoriales en los que ejerzan sus competencias: 
•	a) Sí 
•	b) No 
•	c) En la regulación normativa no se contempla esa posibilidad 
•	d) No existen respuestas correctas 
•	Respuesta Correcta: a 
46. ¿Cuáles son los órganos de dirección y gestión de los recursos y centros de atención primaria y especializada que les sean asignados por la Dirección-Gerencia del Sescam? 
•	a) Las gerencias de atención integrada. 
•	b) Las gerencias de atención primaria 
•	c) Las gerencias de atención especializada 
•	d) Las gerencia de atención inmediata y urgente 
•	Respuesta Correcta: a 
47. ¿Cuáles son los órganos de dirección y gestión de los recursos y centros de atención primaria que les sean asignados por la Dirección-Gerencia del Sescam? 
•	a) Las gerencias de atención integrada. 
•	b) Las gerencias de atención primaria 
•	c) Las gerencias de atención especializada 
•	d) Las gerencia de atención inmediata y urgente 
•	Respuesta Correcta: b 
48. ¿Cuáles son los órganos de dirección y gestión de los recursos y centros de atención especializada que les sean asignados por la Dirección-Gerencia del Sescam? 
•	a) Las gerencias de atención integrada. 
•	b) Las gerencias de atención primaria 
•	c) Las gerencias de atención especializada 
•	d) Las gerencia de atención inmediata y urgente 
•	Respuesta Correcta: c 
49. ¿Cuáles son las gerencias de ámbito regional del Sescam? 
•	a) La Gerencia de Urgencias, Emergencias y Transporte Sanitario 
•	b) La Gerencia de Coordinación e Inspección 
•	c) Las dos respuestas anteriores son correctas 
•	d) No hay respuestas correctas 
•	Respuesta Correcta: c 
50. ¿Cuál es la gerencia con atribuciones en materia de dirección y gestión de los recursos y centros que les sean asignados para la atención de situaciones de urgencia, emergencia y catástrofe, así como el transporte urgente, en coordinación con los recursos de las otras gerencias? 
•	a) La Gerencia de Coordinación e Inspección 
•	b) La Dirección-Gerencia del Sescam 
•	c) La gerencia de atención integrada 
•	d) La Gerencia de Urgencias, Emergencias y Transporte Sanitario 
•	Respuesta Correcta: d 
51. ¿Cuál es la gerencia con atribuciones en materia de dirección y gestión de los recursos para el cumplimiento de las funciones de inspección, coordinación y evaluación en el ámbito de sus competencias? 
•	a) La Gerencia de Coordinación e Inspección 
•	b) La Dirección-Gerencia del Sescam 
•	c) La Gerencia de Urgencias, Emergencias y Transporte Sanitario 
•	d) La gerencia de atención integrada 
•	Respuesta Correcta: a 
52. En caso de vacante, ausencia o enfermedad de la persona titular de la Dirección-Gerencia del Sescam, la firma de los actos y resoluciones de la Dirección-Gerencia corresponderá: 
•	a) al Consejero de Sanidad en todos los casos 
•	b) en primer término, a la persona titular de la Secretaría General y, en segundo término, a la persona titular de la Dirección General de Asistencia Sanitaria. 
•	c) a la persona titular de la Subdirección-Gerencia 
•	d) al titular de la Dirección General de Asistencia Sanitaria. 
•	Respuesta Correcta: b 
53. Según el art. 11 del Decreto 82/2019, de 16 de julio, las gerencias del SESCAM se crean, modifican y suprimen: 
•	a) por Orden de la Consejería competente en materia de asistencia sanitaria. 
•	b) por Decreto del Consejo de Gobierno 
•	c) por Decreto del Presidente del Consejo de Gobierno 
•	d) por orden ministerial 
•	Respuesta Correcta: a 
54. ¿A qué órgano está adscrito el Delegado de Protección de Datos del Sescam? 
•	a) a la Dirección Gerencia del Sescam 
•	b) a la Secretaría General del Sescam 
•	c) a la Consejería competente en materia de sanidad 
•	d) al Consejo de Gobierno 
•	Respuesta Correcta: b 
Bloque 2: Derecho a la Información y a la Confidencialidad (Ley 5/2010)
1. ¿Cuál es la ley autonómica de Castilla-La Mancha sobre derechos y deberes en materia de salud? 
•	a) La ley 5/2010, de 24 de junio 
•	b) La ley orgánica 5/2010, de 24 de junio 
•	c) La ley 8/2000, de 30 de noviembre 
•	d) No existe una ley autonómica sobre esa materia 
•	Respuesta Correcta: a 
2. Art. 1 Ley 5/2010. ¿Cuál es el objeto de la ley de derechos y deberes en materia de salud de Castilla-La Mancha? 
•	a) establecer los deberes en materia de salud de los pacientes y usuarios 
•	b) regular los derechos y deberes en materia de salud, tanto de los pacientes y usuarios como de los profesionales en CLM 
•	c) regular las estructuras que configuran el Sistema Sanitario de Castilla-La Mancha. 
•	d) establecer la igualdad en derechos y obligaciones de mujeres y hombres 
•	Respuesta Correcta: b 
3. Art. 2 Ley 5/2010. El ámbito de aplicación de la Ley sobre derechos y deberes en materia de salud de Castilla-La Mancha incluye: 
•	a) a todas las personas que residan en los municipios de la Comunidad Autónoma de CLM. 
•	b) a los profesionales de los centros, servicios y establecimientos sanitarios ubicados en el territorio de la comunidad autónoma. 
•	c) Las respuestas a) y b) son correctas 
•	d) No hay respuestas correctas 
•	Respuesta Correcta: c 
4. Art. 4 Ley 5/2010. En relación con el derecho a la intimidad, señala la respuesta que NO sea correcta: 
•	a) Toda persona tiene derecho a ser atendida en un medio que garantice su intimidad 
•	b) Toda persona tiene derecho a limitar, en los términos establecidos por la normativa vigente, la grabación y difusión de imágenes mediante fotografías, videos u otros medios que permitan su identificación. 
•	c) El paciente en riesgo de muerte tiene derecho a recibir o rechazar asistencia espiritual y moral incluso de un representante de su religión siempre que no se perjudique la actuación sanitaria. 
•	d) En cualquier actividad de investigación biomédica o en proyectos docentes se garantizará el respeto a la intimidad de las personas, 
•	Respuesta Correcta: c 
5. Art. 5 Ley 5/2010. En relación con el derecho de confidencialidad de la información relativa a la salud: 
•	a) toda persona tiene derecho a que se respete el carácter confidencial de la información relacionada con su salud y con su estancia en centros sanitarios, públicos y privados 
•	b) toda persona tiene derecho a que nadie pueda acceder a esa información sin previa autorización amparada por la Ley. 
•	c) respuestas a) y b) son correctas 
•	d) no hay respuestas correctas 
•	Respuesta Correcta: c 
6. Art. 9 Ley 5/2010. Señala lo que NO sea correcto en relación con el derecho a la información asistencial: 
•	a) Toda persona tiene derecho a recibir la información disponible sobre su proceso y sobre la atención sanitaria recibida. 
•	b) Deberá respetarse la voluntad del paciente de no ser informado. 
•	c) La renuncia al derecho a ser informado podrá formularse verbalmente o por escrito y se incorporará a la historia clínica. La renuncia no podrá ser revocada. 
•	d) Podrá restringirse el derecho a no ser informado cuando sea necesario en interés de la salud del paciente, de terceros, de la colectividad... 
•	Respuesta Correcta: c 
7. Art. 9 Ley 5/2010. Señala lo que NO sea correcto en relación con el derecho a la información sanitaria: 
•	a) La información, como regla general, se proporcionará al paciente verbalmente, dejando constancia escrita en la historia clínica. 
•	b) Esta información deberá darse de forma comprensible, adaptada a la capacidad de cada persona. 
•	c) Corresponde al Director médico del hospital garantizar el cumplimiento del derecho a la información de acuerdo con lo dispuesto y facilitarle la información al paciente 
•	d) La información deberá se proporcionará al paciente con antelación suficiente a la actuación asistencial para permitir a la persona elegir con libertad y conocimiento de causa. 
•	Respuesta Correcta: c 
8. Art. 10 Ley 5/2010. Señala lo que NO sea correcto con arreglo al derecho a la información sanitaria: 
•	a) El titular del derecho a la información asistencial es el paciente.. 
•	b) Se informará a las personas vinculadas al paciente por razones familiares o de hecho aún en el caso de que éste no lo permita 
•	c) Se informará a las personas vinculadas al paciente por razones familiares o de hecho cuando éste lo permita expresa o tácitamente 
•	d) No hay respuestas incorrectas 
•	Respuesta Correcta: b 
9. Art. 10 Ley 5/2010. En relación con el derecho a la información sanitaria en el caso de menores de dieciséis años no emancipados se informará, además de al propio menor: 
•	a) a los padres o tutores 
•	b) al Ministerio fiscal 
•	c) al juez de menores 
•	d) al director del centro sanitario 
•	Respuesta Correcta: a 
10. Art. 10 Ley 5/2010. En relación con el derecho a la información sanitaria en el caso de mayores de dieciséis años o menores emancipados ¿a quién se le debe informar? 
•	a) Unicamente al paciente 
•	b) A los padres o tutores y al Ministerio fiscal en todos los casos 
•	c) Al propio paciente y a los padres y tutores, pero a éstos solo en el supuesto de actuación de grave riesgo, según el criterio del facultativo. 
•	d) al director del hospital 
•	Respuesta Correcta: c 
11. Art. 10 Ley 5/2010. En relación con el derecho a la información sanitaria cuando, a criterio del médico responsable, el paciente carezca de capacidad para comprender la información o para hacerse cargo de su situación a causa de su estado físico o psíquico: 
•	a) se informará a las personas vinculadas a él por razones profesionales 
•	b) se informará a las personas vinculadas a él por razones familiares o de hecho. 
•	c) se informará de modo inexcusable al Ministerio Fiscal 
•	d) se informará al juez que declaró la incapacitación 
•	Respuesta Correcta: b 
12. Art. 10 Ley 5/2010. En relación con el derecho a la información sanitaria, en el caso del paciente declarado incapaz ¿quién será el titular de ese derecho? 
•	a) el propio paciente, únicamente, en un lenguaje adecuado que permita la comprensión de la misma. 
•	b) el tutor, en los términos que fije la sentencia de incapacitación y sin perjuicio del derecho del incapacitado a recibir información sobre su salud en un lenguaje adecuado que permita la comprensión de la misma. 
•	c) el Ministerio Fiscal y el juez de menores 
•	d) el juez que declaró la incapacidad 
•	Respuesta Correcta: b 
13. Art. 11 Ley 5/2010. En relación con la garantía de la información asistencial recogida en ese precepto: 
•	a) En todos los centros, servicios y establecimientos sanitarios debe asignarse al paciente para cada proceso un profesional sanitario 
•	b) El profesional sanitario asignado será el coordinador del proceso asistencial 
•	c) El profesional asignado será el responsable de la información así como su interlocutor principal con el equipo asistencial. 
•	d) Todas las respuestas son correctas 
•	Respuesta Correcta: d 
14. Art. 12 Ley 5/2010. Respecto al derecho a la información epidemiológica: 
•	a) Las personas tienen derecho a conocer los problemas sanitarios de la colectividad cuando impliquen un riesgo para la salud. 
•	b) Las autoridades sanitarias deberán ofrecer información suficiente sobre las situaciones y las causas de riesgo para la salud individual y colectiva 
•	c) Las personas tienen derecho a recibir dicha información que deberá estar basada en el conocimiento científico actual. 
•	d) Todas las respuestas son correctas 
•	Respuesta Correcta: d`;

const blocks = rawText.split(/Bloque \d+:/).filter(b => b.trim() !== "");
const rawBloque1 = "Bloque 1:" + blocks[0];
const rawBloque2 = "Bloque 2:" + blocks[1];

function parseQuestions(text, temaStr) {
    const qBoxes = text.split(/\n\d+\.\s+/).filter(q => q.trim() !== "");
    // First element contains the header, so drop it or adjust index
    // Let's refine the split
    const qs = [];
    const lines = text.split('\n');
    let currentQ = null;
    let blockTitle = "";

    for (let line of lines) {
        if (line.startsWith("Bloque ")) {
            blockTitle = line.trim();
            continue;
        }

        const qMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (qMatch) {
            if (currentQ) qs.push(currentQ);

            currentQ = {
                id: `t4_${Math.random().toString(36).substr(2, 9)}`,
                tema: temaStr,
                pregunta: qMatch[2].trim(),
                opciones: {},
                correcta: "",
                explicacion: "",
                origen: "MAD"
            };
        } else if (currentQ) {
            if (line.includes('•	a) ') || line.trim().startsWith('a) ')) {
                currentQ.opciones.a = line.replace(/.*a\)\s*/, '').trim();
            } else if (line.includes('•	b) ') || line.trim().startsWith('b) ')) {
                currentQ.opciones.b = line.replace(/.*b\)\s*/, '').trim();
            } else if (line.includes('•	c) ') || line.trim().startsWith('c) ')) {
                currentQ.opciones.c = line.replace(/.*c\)\s*/, '').trim();
            } else if (line.includes('•	d) ') || line.trim().startsWith('d) ')) {
                currentQ.opciones.d = line.replace(/.*d\)\s*/, '').trim();
            } else if (line.includes('Respuesta Correcta:') || line.includes('Respuesta correcta:')) {
                const ansMatch = line.match(/Respuesta [Cc]orrecta:\s*([a-d])/);
                if (ansMatch) {
                    currentQ.correcta = ansMatch[1].toLowerCase();
                }
            } else if (line.trim() !== "") {
                // If it's none of the above, append to the question text
                if (Object.keys(currentQ.opciones).length === 0 && !line.includes('Respuesta Correcta')) {
                    currentQ.pregunta += " " + line.trim();
                }
            }
        }
    }
    if (currentQ) qs.push(currentQ);
    return qs;
}

const qs1 = parseQuestions(rawBloque1, "Tema 4: Ordenación Sanitaria y Derechos (Bloque 1: Ley 8/2000 - Ordenación Sanitaria CLM)");
const qs2 = parseQuestions(rawBloque2, "Tema 4: Ordenación Sanitaria y Derechos (Bloque 2: Ley 5/2010 - Derechos y Deberes CLM)"); // adjusted name 

// Add them to questions
['a', 'b', 'c', 'd'].forEach(x => {
    // just dummy test
})

questions.push(...qs1);
questions.push(...qs2);

// Re-map Tema 4 old questions if they exist just as "Tema 4" mapped to something
questions = questions.map(q => {
    if (q.tema === "Tema 4" && !q.id.startsWith("t4_")) { // If they represent old ones, rename them to Bloque 1 or similar if the user didn't specify. Wait, user said "TEMA 4: ORDENACIÓN SANITARIA Y DERECHOS. Bloque 1: ... Bloque 2: ... ". The old Tema 4 was "Autonomía del paciente e información". That actually overlaps with Ley 41/2002. We'll rename old "Tema 4" to Tema 4 : Ordenación Sanitaria y Derechos (Bloque 3: Ley 41/2002) so it doesn't get lost.
        q.tema = "Tema 4: Ordenación Sanitaria y Derechos (Bloque 3: Ley 41/2002 - Autonomía del paciente)";
    }
    return q;
});

fs.writeFileSync('c:/Users/34678/Desktop/web-test-pinche/data/preguntas.json', JSON.stringify(questions, null, 2));
console.log("JSON parsed and updated. Replaced Temas and inserted Tema 4! Questions total:", questions.length, " Added from Tema 4:", qs1.length + qs2.length);

