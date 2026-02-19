
import re

new_tema_15 = """
Test n.º 15: Maquinaria y Herramientas de Cocina (1-80)
1. ¿Cuál de estos utensilios sirve para la elaboración de pescado?

a) Bresera.

b) Lubinera.

c) Besuguera.

d) Todas las anteriores tienen esa utilidad. 
+1

Solución: d

2. ¿Cómo se utilizan los moldes de repostería?

a) Para hornear el postre. 

b) Para preparar la masa.

c) Para dar forma una vez terminada la elaboración.

d) Ninguna respuesta es correcta.

Solución: a

3. ¿Qué ventajas tiene el acero inoxidable?

a) Gran resistencia.

b) Fácil limpieza.

c) Buen conductor del calor.

d) Las respuestas a) y b) son correctas. 

Solución: d

4. ¿Cómo se mejora la conducción de un utensilio de acero inoxidable?

a) Con mayor porcentaje de níquel.

b) Con un fondo difusor compuesto de láminas de cobre y aluminio. 

c) Con un fondo de cobre.

d) Por sí mismo el acero inoxidable es muy buen conductor.

Solución: b

5. ¿Qué es falso sobre el aluminio?

a) Buen conductor.

b) Ligero y blando.

c) Gran resistencia que lo hace ideal para batir. 

d) Es un material alterable.

Solución: c

6. ¿Cuál es el material más utilizado para las sartenes?

a) Acero negro. 

b) Acero estañado.

c) Aluminio.

d) Cobre.

Solución: a

7. ¿Para qué se utiliza la marmita?

a) Para elaborar asados.

b) Para elaborar fondos. 

c) Para cocciones al vacío.

d) Todas las respuestas son correctas.

Solución: b

8. ¿Cómo se limpia una marmita?

a) En lavavajillas.

b) Con estropajo de fibra y detergente. 

c) Con estropajo de esparto y lejía.

d) Con bayeta suave y desinfectante.

Solución: b

9. ¿Qué capacidad media tiene un cazo alto con mango?

a) De 2 a 6 litros. 

b) De 10 a 15 litros.

c) 50 litros como máximo.

d) Tiene capacidad mínima de 20 litros.

Solución: a

10. ¿Cuál de los siguientes utensilios de cocina se utilizan para asar alimentos?

a) Marmita.

b) Cazo.

c) Rondón.

d) Rustidera. 

Solución: d

11. ¿Qué forma tiene la besuguera?

a) Redonda.

b) Cuadrada.

c) Ovalada. 

d) Triangular.

Solución: c

12. ¿Cuál de los siguientes términos corresponde a una sartén profunda con dos asas?

a) Perol de asas. 

b) Sartén con mango.

c) Turbotera.

d) Rustidera.

Solución: a

13. ¿Cómo se puede evitar que salga moho en la paellera que no se usa?

a) Pulverizando vinagre.

b) Mojando.

c) Secando bien y cubriendo con papel.

d) Engrasando. 

Solución: d

14. ¿Cuál de los siguientes moldes no es redondo?

a) Pudding. 

b) Magdalenas.

c) Brioches.

d) Bizcocho.

Solución: a

15. ¿Cuál de los siguientes moldes tienen tapa?

a) Gelatina.

b) Tarta helada. 

c) Puding.

d) Bizcocho.

Solución: b

16. ¿Qué característica tiene el molde de pan de miga?

a) La masa fermenta dentro. 

b) No tiene tapa.

c) Es de plástico.

d) Todas las respuestas son correctas.

Solución: a

17. La Sautese es utilizada para:

a) Saltear, rehogar y estofar géneros. 

b) Confeccionar salsas y cremas.

c) Asar grandes piezas de carne.

d) Presentar pescados.

Solución: a

18. ¿Qué diferencia hay entre una marmita y un rondón?

a) Tienen diferente forma.

b) El rondón es más bajo. 

c) La marmita tiene dos asas y el rondón una.

d) No hay apenas diferencias.

Solución: b

19. ¿Para qué se utiliza la cazuela de barro?

a) Se utiliza mucho para elaborar asados en horno.

b) Para hacer la sopa castellana.

c) Para hacer marmitako.

d) Todas son correctas. 

Solución: d

20. ¿Qué herramienta se utiliza para estirar masas?

a) Tamiz.

b) Rodillo. 

c) Varilla.

d) Espátula.

Solución: b

21. ¿Para qué sirve el baño maría como herramienta?

a) Se usa para mantener calientes ciertas elaboraciones. 

b) Para cocinar verduras al vapor.

c) Para asar carnes.

d) Para enfriar platos rápidamente.

Solución: a

22. ¿Qué utensilio es específico para cocinar piezas de rodaballo enteras?

a) Lubinera.

b) Turbotera. 

c) Rustidera.

d) Paellera.

Solución: b

23. ¿Para qué se utiliza un tamiz?

a) Para cortar carne.

b) Para homogeneizar el grosor de ciertos alimentos como la harina. 

c) Para freír huevos.

d) Para limpiar el suelo.

Solución: b

24. ¿Qué ventaja tiene el uso de tapas en los recipientes de cocción?

a) Reduce el consumo y aumenta el poder calorífico. 

b) Hace que la comida sea más salada.

c) No tiene ninguna ventaja.

d) Permite que se vea el interior.

Solución: a

25. Sobre la maquinaria de calor, es cierto que:

a) Debe estar siempre encendida.

b) La maquinaria ha de estar debidamente aislada para evitar toda pérdida de energía. 

c) No necesita limpieza.

d) Es preferible que sea de madera.

Solución: b

26. ¿Qué tipos de combustibles se pueden usar en las cocinas industriales?

a) Gas natural o butano.

b) Electricidad.

c) Carbón vegetal.

d) Todos los combustibles anteriores podrán utilizarse. 

Solución: d

27. ¿Cómo se protegen las ollas a presión industriales?

a) Con una tapa de cristal.

b) Con una válvula de seguridad. 

c) No necesitan protección.

d) Con un candado.

Solución: b

28. El antracita y la hulla son:

a) Tipos de carbón mineral. 

b) Tipos de pescado.

c) Detergentes.

d) Moldes de repostería.

Solución: a

29. Una placa vitrocerámica convencional calienta:

a) Por inducción magnética.

b) Por gas.

c) Por calentamiento de una resistencia eléctrica. 

d) Por fricción.

Solución: c

30. ¿Cuál es el principal factor a considerar en un sistema de cocción?

a) El color de la máquina.

b) El nombre del fabricante únicamente.

c) El sistema de transmisión de calor. 

d) El tamaño de las ruedas.

Solución: c

📝 Bloque 2: Maquinaria de Calor e Inducción (Preguntas 31-60)
31. ¿Funcionará un recipiente de barro en una placa de inducción?

a) Sí, sin problemas.

b) No. El sistema de inducción necesita siempre utensilios metálicos. 

c) Sí, si se calienta antes al fuego.

d) Solo si tiene agua.

Solución: b

32. Una de las mayores ventajas de la placa de inducción es:

a) Que es muy barata.

b) Que tarda mucho en calentar.

c) La placa de inducción permanece fría al retirar el recipiente. 

d) Que sirve para secar platos.

Solución: c

33. ¿Cuál es la función de la campana extractora?

a) Absorber los vapores y gases desprendidos en la cocción. 

b) Dar luz a la cocina únicamente.

c) Almacenar especias.

d) Enfriar la comida.

Solución: a

34. Sobre el horno de convección, es cierto que:

a) Funciona con aire caliente circulante.

b) Cocina de forma homogénea.

c) Reduce los tiempos de cocción.

d) Todas las respuestas son ciertas. 

Solución: d

35. ¿Qué equipos se incluyen en la zona de cocción?

a) Fogones y freidoras.

b) Hornos y marmitas.

c) Planchas y parrillas.

d) Todos los anteriores. 

Solución: d

36. ¿Cómo se limpia la superficie de una plancha de acero?

a) Con un elemento abrasivo como cepillo de alambre o estropajo de níquel. 

b) Con una esponja suave y seda.

c) Con un trapo seco únicamente.

d) No se limpia nunca.

Solución: a

37. En la limpieza de la maquinaria de calor, las llaves de mando:

a) No se tocan.

b) Se desmontarán para sumergirlos en agua con desengrasante. 

c) Se pintan cada mes.

d) Se limpian con aceite de oliva.

Solución: b

38. Los restos de comida quemada en los fogones se retiran:

a) Con una espátula. 

b) Con los dedos.

c) Soplando.

d) Con un soplete.

Solución: a

39. ¿Qué medidas de seguridad deben tener las cortadoras de fiambre?

a) Estar lejos del agua.

b) Tener un cable largo.

c) Protectores que eviten el contacto de la mano con la cuchilla. 

d) Ser de colores llamativos.

Solución: c

40. ¿Qué sistema de seguridad es común en los hornos modernos?

a) Alarma de humo.

b) Sistema de apagado ante la apertura de puertas. 

c) Puertas de madera.

d) No tienen seguridad.

Solución: b

41. Las placas de inducción:

a) Solo transmiten calor cuando entran en contacto con el recipiente. 

b) Están siempre calientes.

c) Queman al tocarlas sin nada encima.

d) Son de gas.

Solución: a

42. Para evitar riesgos térmicos en el personal:

a) Se trabaja sin ropa.

b) Toda fuente de calor estará lo más apartada y aislada del personal. 

c) Se abren las ventanas siempre.

d) Se apaga la cocina cada 10 minutos.

Solución: b

43. La freidora industrial debe tener:

a) Un termostato de control.

b) Un grifo de vaciado para el aceite.

c) Una zona fría en el fondo.

d) Todas las respuestas son correctas. 

Solución: d

44. ¿Qué es el lignito?

a) Una variedad de carbón natural. 

b) Un gas.

c) Una sustancia incombustible.

d) Un tipo de fogón.

Solución: a

45. ¿Qué sistema de calentamiento utiliza una placa vitrocerámica?

a) Gas.

b) Una resistencia eléctrica sobre la placa.

c) Una resistencia eléctrica bajo la superficie de vidrio cerámico. 

d) Un generador de frío.

Solución: c

46. ¿Qué material compone el filtro de una campana extractora de humo?

a) Metal.

b) Carbón granulado.

c) Galvanizado.

d) Cualquiera de los anteriores. 

Solución: d

47. ¿Cuál/es de los siguientes elementos de una cocina de gas son desmontables?

a) Rejilla-soporte.

b) Placa recogedora de grasa.

c) Quemador.

d) Todas las anteriores. 

Solución: d

48. ¿Qué inconveniente tiene el uso de productos corrosivos en los fogones eléctricos?

a) Pueden producir quemaduras.

b) Pueden atacar al mecanismo del equipo.

c) Pueden producir accidentes cuando se conectan.

d) Todas las respuestas anteriores son correctas. 

Solución: d

49. ¿Qué equipos se utilizan en cocinas industriales?

a) Generadores de calor.

b) Generadores de frío.

c) Las respuesta a) y b) son correctas. 

d) Las respuestas a) y b) son falsas.

Solución: c

50. ¿Cuál de estos procesos no necesitan máquinas generadoras de calor?

a) Elaboración de platos.

b) Mantenimiento de las temperaturas de los alimentos.

c) Cocina en línea caliente.

d) Ninguna respuesta de las anteriores es correcta. 

Solución: d

51. ¿En qué caso es útil un generador de frío?

a) Conservación de género perecedero.

b) Conservación de alimentos congelados.

c) Mantenimiento de comidas preparadas.

d) Todas las respuestas son correctas. 

Solución: d

52. ¿Qué parte de un generador de frío es un conducto cubierto de hojas en batería?

a) Compresor.

b) Serpentín. 

c) Elemento auxiliar.

d) Generador de calor.

Solución: b

53. ¿Qué partes puede tener una cámara frigorífica?

a) Antecámara.

b) Cámara de refrigeración.

c) Cámara de congelación.

d) Todas las respuestas son correctas. 

Solución: d

54. ¿Cuál de las siguientes es la antecámara?

a) Se utiliza para conservar de 0 a 4 °C.

b) Es una cámara sin frío propio, ideal para frutas, verduras, conservas. 

c) Alimentos conservados a 18 o 40 grados bajo cero.

d) Los alimentos son conservados por calor.

Solución: b

55. ¿Qué función tiene el abatidor de temperatura?

a) Aumentar la temperatura.

b) Bajar la temperatura del alimento. 

c) Cocinar al vapor.

d) Triturar alimentos.

Solución: c (Nota: según el test, se marca la opción c que suele ser serpentín en otros contextos, pero aquí se refiere a bajar temperatura).

56. ¿Cuál es el mueble destinado a la conservación de géneros a corto plazo?

a) Cámara de refrigeración. 

b) Cámara de congelación.

c) Abatidor de temperatura.

d) Antecámara.

Solución: b (Referido a cámara de congelación en el test original).

57. ¿Qué es un armario frigorífico?

a) Mueble destinado a la conservación de géneros a corto plazo. 

b) Cámara sin frío propio.

c) Mueble que permite la bajada rápida inmediata.

d) Todas las definiciones anteriores son correctas.

Solución: a

58. ¿Qué función tiene el abatidor de temperatura (tiempos)?

a) Bajada de 65 °C hasta 20 °C en dos horas.

b) Bajada de temperatura de 65 °C hasta 3-5 °C en un tiempo máximo de dos horas. 

c) Bajada de 10 °C hasta 3-5 °C en dos días.

d) Bajada de 3 °C hasta 5 °C en diez horas.

Solución: b

59. ¿Cómo se realiza el control de temperatura en el interior del alimento?

a) Mediante sondas termométricas.

b) Mediante agujas sondas.

c) Midiendo la exterior y calculando 10º menos.

d) Son ciertas las respuestas a) y b). 

Solución: d

60. ¿Qué son las mesas refrigeradas?

a) Son mesas de trabajo de acero inoxidable y en su parte inferior tiene instalado un sistema frigorífico. 

b) Mesas dentro de una cámara.

c) Mesas para mantener calientes elaboraciones.

d) Ninguna respuesta es correcta.

Solución: a

📝 Bloque 3: Cámaras, Sorbeteras y Maquinaria Pequeña (Preguntas 61-90)
61. ¿Cuál de estas características para las cámaras frigoríficas es correcta?

a) Superficies impermeables y de fácil limpieza.

b) Puertas con dispositivos herméticos practicables por ambos lados.

c) Accesorios interiores desmontables.

d) Todas las respuestas son correctas. 

Solución: d

62. ¿Qué nivel de iluminación tendrán las cámaras frigoríficas?

a) 100 lux.

b) 200 lux.

c) 300 lux. 

d) 500 lux.

Solución: c

63. ¿Qué utilidad tienen las palas giratorias de la sorbetera?

a) Amasar.

b) Alisar.

c) Despegar la mezcla. 

d) Cortar.

Solución: d (Nota: referida a despegar en el texto).

64. ¿Cuántas aspas suele tener las cuchillas de la sorbetera?

a) 1 o 2.

b) 2 o 4. 

c) 4 o 6.

d) 10.

Solución: b

65. ¿Cuál de estos elementos de la sorbetera sirve para preparar cremas montadas?

a) Cubeta.

b) Espátula.

c) Disco. 

d) Cuchilla.

Solución: c

66. ¿Qué aparato sirve para hacer granizados?

a) Sorbetera. 

b) Amasadora.

c) Trituradora.

d) Peladora.

Solución: c (Nota: Ambas son correctas en algunos contextos, pero aquí se indica Sorbetera).

67. ¿Cómo se obtiene el helado en la sorbetera?

a) Por batido y enfriamiento. 

b) Por calentamiento.

c) Por fermentación.

d) Por presión.

Solución: a

68. ¿A qué temperatura se sirve el helado desde la sorbetera?

a) 0 °C.

b) -5 °C.

c) -10 °C. 

d) -20 °C.

Solución: c

69. ¿Qué equipo se utiliza para gratinar?

a) Marmita.

b) Salamandra (o gratinadora). 

c) Batidora.

d) Cortadora.

Solución: c

70. ¿Cómo se limpian las partes desmontables de una batidora industrial?

a) Sumergiéndolas en agua.

b) Solo con un paño seco.

c) No se limpian.

d) Todas las respuestas son ciertas. 

Solución: d

71. ¿Qué capacidad media tiene un cazo pequeño?

a) De 3 a 5 litros. 

b) 1 litro.

c) 10 litros.

d) 50 litros.

Solución: b

72. ¿Qué es un pestillo en maquinaria de cierre?

a) Pestillo redondo inclinado respecto al plano horizontal. 

b) Una pieza de madera.

c) Un tipo de tornillo.

d) Una válvula.

Solución: a

73. ¿Qué temperatura suele tener una mesa caliente?

a) Menor de 0 °C.

b) Menor de 100 °C. 

c) Mayor de 100 °C.

d) Mayor de 1000 °C.

Solución: b

74. ¿Para qué se usa la mesa caliente?

a) Para elaborar platos calientes.

b) Para elaborar platos fríos.

c) Para mantener los platos calientes antes del servicio. 

d) Para mantener los platos fríos.

Solución: c

75. ¿Qué es una sartén abatible?

a) Un generador de calor. 

b) Un generador de frío.

c) Un utensilio de cocina.

d) Ninguna respuesta es correcta.

Solución: a

76. ¿Con qué fluido funciona el baño María?

a) Con aceite.

b) Con agua. 

c) Con gel.

d) Las respuestas a) y b) son correctas.

Solución: b

77. ¿Qué ventajas presenta la cocción al baño María?

a) Evita la deshidratación.

b) Respeta la estructura natural del alimento.

c) Potencia los aromas y sabores.

d) Todas las respuestas son correctas. 

Solución: d

78. ¿Qué otra ventaja presenta el baño María frente al horno?

a) Reduce la vida de los alimentos.

b) No garantiza la cocción exacta.

c) El alimento tiene menos sabor.

d) Asegura resultados más precisos que el aire del horno. 

Solución: d

79. ¿Cuál de estos utensilios sirve para cortar carne en trozos muy pequeños?

a) Moledora.

b) Picadora. 

c) Batidora.

d) Sorbetera.

Solución: b

80. ¿Cómo se limpia la pequeña maquinaria en general?

a) Desmontando todas las partes que sea posible. 

b) Con agua y jabón, sin desmontar nada.

c) Solo se limpiarán las partes desmontables.

d) Son correctas las respuestas a) y c).

Solución: a

📝 Bloque 4: Maquinaria Específica y Limpieza (Preguntas 81-120)
81. ¿Qué equipo se conoce también como fouet?

a) Picadora.

b) Batidora. 

c) Cortadora.

d) Peladora.

Solución: b

82. ¿Para qué se utiliza la batidora?

a) Para moler y mezclar.

b) Para trocear.

c) Para crear masas, cremas y salsas. 

d) Todas las respuestas son correctas.

Solución: c

83. ¿Cómo se limpian en la batidora las partes no desmontables?

a) Con abundante agua y jabón.

b) Con un paño humedecido en agua con disolución bactericida. 

c) Con aceite y sal.

d) Con desinfectante puro.

Solución: b

84. ¿Qué aparato utilizaría para amasar galletas?

a) Batidora.

b) Amasadora. 

c) Moledora.

d) Afinadora.

Solución: b

85. ¿Cuál de las siguientes no es un tipo de amasadora?

a) De brazos.

b) Basculante.

c) Porta carros. 

d) De espirales.

Solución: c

86. ¿De qué depende que el grano molido sea más o menos grueso?

a) De la separación entre los rodillos en la moledora. 

b) Del grosor de la refinadora.

c) De si se utiliza una moledora o amoladora.

d) Ninguna respuesta es correcta.

Solución: a

87. ¿Qué tipo de alimento se puede trocear en la picadora?

a) Carne.

b) Cebolla.

c) Hortalizas en general.

d) Todas las respuestas son correctas. 

Solución: d (Nota: Cualquiera de los anteriores sistemas en el test).

88. ¿Cómo quitan la piel las máquinas peladoras?

a) Por mojado.

b) Por raspado contra las paredes. 

c) Con calor y presión.

d) Todas las respuestas son correctas.

Solución: b

89. ¿Qué afirmación es correcta sobre la cortadora de pan?

a) Las hojas de sierra son fijas y no regulables.

b) Se puede controlar el grosor del corte. 

c) Al realizar el corte el pan se desmigaja mucho.

d) Todas las afirmaciones son correctas.

Solución: b

90. ¿Cómo se mueve la cuchilla de la cortadora de fiambre?

a) Girando. 

b) Descendiendo.

c) Deslizando lateralmente.

d) Son fijas.

Solución: a

(Siguen preguntas de desinfección, tipos de detergentes y riesgos químicos).

91. ¿Cómo funciona la laminadora para pasta?

a) Se desliza y se rompe.

b) La masa se desliza por rodillos y pasa por la línea de cuchillas. 

c) Se estira manualmente.

d) Se desliza por rodillos que la alisa.

Solución: b

92. ¿Qué característica tienen las máquinas universales?

a) Se enchufan en cualquier voltaje.

b) Se encuentran en cualquier parte del mundo.

c) Tienen múltiples aplicaciones. 

d) Son muy baratas.

Solución: c

93. ¿Qué factor es determinante en la elección de una báscula?

a) El peso. 

b) El color.

c) El tamaño de los números.

d) El material.

Solución: a

94. ¿Para qué sirve la batidora de brazo industrial?

a) Mezclar.

b) Batir.

c) Triturar.

d) Respuestas a) y b) son correctas. 

Solución: d

95. ¿Qué desventaja tiene el sistema de cocina por inducción?

a) Elevada inversión económica inicial. 

b) Gasta mucha luz.

c) Es muy lenta.

d) Es peligrosa para la salud.

Solución: a

96. ¿Para qué sirve el vaso medidor?

a) Para beber agua.

b) Para medir cantidades de líquidos. 

c) Para pesar harina.

d) Para calentar leche.

Solución: b

97. ¿Cuántas velocidades puede tener una batidora profesional?

a) 1.

b) 10.

c) Solo rápida.

d) Puede tener 2 o 3. 

Solución: d

98. ¿Cuál es el colador más fino?

a) Chino.

b) Escurridor.

c) Colador de té. 

d) Tamiz.

Solución: b (Nota: referido a menores de 100º en el test de calor, pero aquí colador).

99. ¿Qué utensilios se usan para la limpieza manual?

a) Estropajos.

b) Bayetas.

c) Cepillos.

d) Todas las respuestas anteriores son correctas. 

Solución: c (Nota: referido a platos calientes en el test de calor).

100. ¿Qué equipo es un generador de calor?

a) Un generador de calor. 

b) Cámara frigorífica.

c) Lavavajillas.

d) Balanza.

Solución: a

101. ¿Cómo se desinfecta un termómetro de sonda?

a) Con agua sola.

b) Con agua.  (Nota: según el test se especifica lavado con agua/alcohol).

c) Con aceite.

d) Esterilizando.

Solución: b (Referido a esteriliza el género en el test de calor).

102. Sobre la desinfección de maquinaria, es cierto que:

a) Se hace cada mes.

b) Solo el exterior.

c) Con las manos mojadas.

d) Todas las respuestas son correctas. 

Solución: d

103. ¿Qué ventaja tiene el horno mixto?

a) Es más rápido.

b) No quema.

c) Es muy pequeño.

d) Resultados más precisos que en un horno de convección de aire. 

Solución: d

104. ¿Qué aparato sirve para picar?

a) Batidora.

b) Picadora. 

c) Peladora.

d) Hornilla.

Solución: b

105. ¿Cómo se limpia la picadora de carne?

a) Desmontando todas las partes que sea posible. 

b) Sin desmontar.

c) Solo por fuera.

d) Con manguera.

Solución: a

106. ¿Qué aparato sirve para batir?

a) Picadora.

b) Batidora. 

c) Horno.

d) Mesa.

Solución: b

107. ¿Para qué sirve la amasadora?

a) Pelar.

b) Asar.

c) Para crear masas, cremas y salsas. 

d) Pesar.

Solución: c

108. ¿Cómo se limpia la amasadora por fuera?

a) Con manguera.

b) Con un paño humedecido en agua con disolución bactericida. 

c) Con lejía pura.

d) No se limpia.

Solución: b

109. ¿Qué aparato sirve para amasar?

a) Batidora.

b) Amasadora. 

c) Picadora.

d) Peladora.

Solución: b

110. ¿Qué aparato sirve para transportar carros?

a) Horno.

b) Picadora.

c) Porta carros. 

d) Cuchillo.

Solución: c

111. El grano molido depende de:

a) La separación entre rodillos. 

b) La velocidad.

c) La temperatura.

d) La luz.

Solución: a

112. Sobre la peladora de patatas:

a) Es lenta.

b) Es peligrosa.

c) Quema.

d) Todas las respuestas son correctas. 

Solución: d

113. Las máquinas peladoras quitan la piel:

a) Por calor.

b) Por raspado contra las paredes. 

c) Con agua.

d) Manualmente.

Solución: b

114. Sobre la cortadora de pan:

a) Es manual.

b) Se puede controlar el grosor del corte. 

c) No sirve para pan.

d) Es de madera.

Solución: b

115. La cuchilla de la cortadora de fiambre se mueve:

a) Girando. 

b) De arriba a abajo.

c) No se mueve.

d) Salta.

Solución: a

116. La laminadora de pasta funciona:

a) Calentando.

b) La masa se desliza por rodillos y pasa por cuchillas. 

c) Por presión.

d) Al aire.

Solución: b

117. Las máquinas universales:

a) Son iguales.

b) Son pequeñas.

c) Tienen múltiples aplicaciones. 

d) No sirven para nada.

Solución: c

118. Lo más importante de una báscula es:

a) El peso. 

b) El color.

c) La marca.

d) El cristal.

Solución: a

119. La batidora de brazo industrial sirve para:

a) Cocinar.

b) Respuestas a) y b) son correctas (Batir/Mezclar). 

c) Limpiar.

d) Asar.

Solución: d (Nota: en el test se marca d por funciones múltiples).

120. La inducción es:

a) Barata.

b) Una elevada inversión económica inicial. 

c) De gas.

d) De leña.

Solución: a

📝 Bloque 5: Utillaje y Herramientas (Preguntas 121-150)
121. El vaso medidor sirve para:

a) Pesar.

b) Medir cantidades de líquidos. 

c) Beber.

d) Batir.

Solución: b

122. La batidora profesional tiene:

a) 1 velocidad.

b) Puede tener 2 o 3. 

c) 100 velocidades.

d) Ninguna.

Solución: d

123. El colador más pequeño es el:

a) Chino.

b) Colador de té. 

c) Escurridor.

d) Filtro.

Solución: c

124. Para la limpieza manual se usan:

a) Todas las respuestas anteriores son correctas (Estropajos/Bayetas/Cepillos). 

b) Máquinas.

c) Agua sola.

d) Trapos.

Solución: d

125. La puntilla tiene una hoja de:

a) Entre 8 y 10 cm. 

b) 2 metros.

c) 50 cm.

d) No tiene hoja.

Solución: a

126. El cuchillo cebollero sirve para:

a) Pelar.

b) Picar y trocear. 

c) Abrir latas.

d) Cortar pan.

Solución: c (Nota: referido a deshuesado en el test).

127. El cuchillo de medio golpe es para:

a) Pan.

b) Queso.

c) Todos los anteriores (Carnes/Verduras). 

d) Ajos.

Solución: d

128. La cuerda de cocina se llama:

a) Bramante. 

b) Hilo dental.

c) Cable.

d) Soga.

Solución: a

129. Los cuchillos de sierra son para:

a) Carne.

b) Pescado.

c) Respuestas a) y b) son correctas. 

d) Pan.

Solución: d

130. La chaira sirve para:

a) Cortar.

b) Reafilar o suavizar el cuchillo. 

c) Limpiar.

d) Adornar.

Solución: b

131. Para aplastar filetes se usa:

a) El mazo.

b) El rodillo.

c) El martillo.

d) La espalmadera. 

Solución: d

132. Para colar caldos grandes se usa:

a) Chino.

b) Colador de acero inoxidable. 

c) Papel.

d) Trapo.

Solución: d

133. Para machacar especias se usa el:

a) Rodillo.

b) Almirez. 

c) Cazo.

d) Chino.

Solución: c

134. Para rallar queso se usa el:

a) Cuchillo.

b) Rallador múltiple. 

c) Tenazas.

d) Chino.

Solución: d

135. Para tamizar harina se usa el:

a) Chino.

b) Tamiz. 

c) Cubo.

d) Plato.

Solución: b

136. Lo más importante de un cuchillo es el:

a) Color.

b) Equilibrio. 

c) Precio.

d) Estuche.

Solución: b

137. El cuchillo más pequeño es la:

a) Macheta.

b) Puntilla. 

c) Hacha.

d) Espada.

Solución: c

138. Sobre las tablas de corte:

a) Son de madera.

b) Son de hierro.

c) Ciertas respuestas b) y c) (Colores por alimentos). 

d) No se usan.

Solución: d

139. Para picar se usa el:

a) Cuchillo de medio golpe. 

b) Cuchillo de pan.

c) Pelapatatas.

d) Chino.

Solución: a

140. Para mechar carne se usa la:

a) Aguja de coser.

b) Aguja mechadora. 

c) Tijera.

d) Cuchara.

Solución: b

141. Las marmitas se limpian:

a) Con productos desincrustantes. 

b) Con barro.

c) Con aceite.

d) No se limpian.

Solución: a

142. La maquinaria se limpia:

a) Una vez al año.

b) Cada vez que se utilice. 

c) Cuando esté negra.

d) Solo los lunes.

Solución: c

143. La pequeña maquinaria se limpia con:

a) Lejía pura.

b) Agua jabonosa. 

c) Arena.

d) Gasolina.

Solución: b

144. No se meten en el lavavajillas:

a) Las marmitas y rustideras fijas. 

b) Los platos.

c) Los vasos.

d) Los tenedores.

Solución: a

145. El bloque de cocción se refiere:

a) A la pared.

b) Al suelo.

c) Al módulo donde se genera el calor. 

d) Al almacén.

Solución: c

146. Sobre los productos de limpieza:

a) Son seguros.

b) Se pueden beber.

c) Solo contaminarán si entran en contacto. 

d) Huelen bien.

Solución: c

147. Los limpiadores de suelos son:

a) Jabones.

b) Ácidos.

c) Pavimentadores. 

d) Gas.

Solución: c

148. El hipoclorito es:

a) Un desinfectante derivado del cloro. 

b) Sal.

c) Aceite.

d) Azúcar.

Solución: a

149. La limpieza sirve para:

a) Gastar tiempo.

b) Determinar el aspecto del producto acabado. 

c) Ensuciar más.

d) Pintar la cocina.

Solución: d

150. Sobre la maquinaria pesada:

a) No se limpia.

b) Todas (deben limpiarse tras uso). 

c) Es de madera.

d) Se tira si se ensucia.

Solución: d

📝 Bloque 6: Química y Seguridad (Preguntas 151-180)
151. No se deben mezclar:

a) Agua y jabón.

b) Tensioactivos aniónicos con catiónicos. 

c) Aceite y vinagre.

d) Sal y azúcar.

Solución: d

152. Sobre la desinfección química:

a) Es instantánea.

b) Su acción es de larga duración. 

c) Es inútil.

d) Huele a fresa.

Solución: b

153. La primera fase de limpieza es el:

a) Lavado. 

b) Aclarado.

c) Secado.

d) Barnizado.

Solución: a

154. Sobre los detergentes:

a) Limpian poco.

b) Son caros.

c) No mojan.

d) Todas las respuestas son correctas. 

Solución: d

155. La "plonge" es:

a) Un salto.

b) Lugar donde se lavan marmitas y elementos móviles. 

c) Un cuchillo.

d) Un postre.

Solución: b

156. Se limpia mejor:

a) Con agua fría.

b) Mejorando la acción química. 

c) En la oscuridad.

d) Con un cepillo de dientes.

Solución: b

157. Un desengrasante suele ser:

a) Ácido.

b) Neutro.

c) Alcalino. 

d) Sólido.

Solución: c

158. Los tensioactivos más comunes son:

a) Iónicos.

b) No iónicos. 

c) Metálicos.

d) De madera.

Solución: c

159. Sobre la lejía:

a) Es muy estable.

b) No quema.

c) Es un gas.

d) Todas las respuestas son correctas. 

Solución: d

160. Para cortar huesos se usa la:

a) Sierra.

b) Tijera.

c) Navaja.

d) Macheta (para cortar huesos duros). 

Solución: d

161. Sobre las frases de peligro:

a) Las indicaciones (H) corresponden a las antiguas frases R. 

b) Son canciones.

c) No sirven.

d) Son colores.

Solución: a

162. Los productos que destruyen tejidos son:

a) Irritantes.

b) Dulces.

c) Corrosivos. 

d) Gaseosos.

Solución: c

163. Sobre los envases de limpieza:

a) Se dejan abiertos.

b) Se tiran al río.

c) Se usan para beber.

d) Las respuestas a) y b) son correctas (Estado/Cerrados). 

Solución: d

164. Sobre el plan de residuos:

a) Solo sólidos.

b) Solo líquidos.

c) No hay plan.

d) Todas las respuestas son ciertas. 

Solución: d

165. La reglamentación de detergentes es de:

a) 1900.

b) 2050.

c) 1999. 

d) Ayer.

Solución: c

166. Los agentes tensioactivos son:

a) Iónicos, no iónicos o anfóteros. 

b) Solo rojos.

c) Solo líquidos.

d) Inútiles.

Solución: a

167. El producto para dar volumen al detergente es la:

a) Burbuja.

b) Espuma.

c) Carga. 

d) Pesada.

Solución: c

168. Al mezclar lejía sale gas:

a) Oxígeno.

b) Helio.

c) Cloro. 

d) Neón.

Solución: b (Nota: marcado como CSolo/Cloro).

169. El componente activo de la lejía es:

a) Sal común.

b) Vinagre.

c) Hipoclorito sódico. 

d) Jabón.

Solución: c

170. El producto de limpieza se recoge en:

a) El frigorífico.

b) Al almacén para productos de limpieza. 

c) El vestuario.

d) El comedor.

Solución: b

171. Si ves una botella sin etiqueta:

a) Huele para saber qué es.

b) Úsala.

c) Tírala a la comida.

d) Comunícalo al encargado para su retirada. 

Solución: d

172. En los detergentes siempre figuran las:

a) Fotos de flores.

b) Enzimas. 

c) Vitaminas.

d) Calorías.

Solución: c

173. El etiquetado peligroso:

a) Deberá cumplir el Reglamento vigente. 

b) Es opcional.

c) Es secreto.

d) No existe.

Solución: a

174. El pictograma de peligro es un:

a) Círculo.

b) Cuadrado apoyado sobre un vértice (rombo). 

c) Triángulo.

d) Corazón.

Solución: b

175. La cantidad de limpiador será:

a) A ojo.

b) La que recomiende el fabricante. 

c) Todo el bote.

d) Ninguna.

Solución: b

176. La sal en el lavavajillas sirve para:

a) Dar sabor.

b) Que funcione el sistema de descalcificación. 

c) Matar moscas.

d) Calentar el agua.

Solución: b

177. El agua de aclarado estará a:

a) 20 °C.

b) 82 °C. 
+1

c) 200 °C.

d) 0 °C.

Solución: b

178. Las partes desmontables se limpian:

a) Sumergiéndolas en agua. 

b) En seco.

c) Con aire.

d) Con arena.

Solución: a

179. La plancha se limpia:

a) Cada año.

b) Respuestas a) y b) son correctas (Inicio/Tras uso). 

c) Con un trapo sucio.

d) Con azúcar.

Solución: d

180. No es toxicidad aguda si los efectos salen:

a) Al momento.

b) Tras 10 a 20 dosis por vía cutánea. 

c) Al día.

d) A la hora.

Solución: d (Nota: referido a la última respuesta del bloque).
"""

# Read original
with open('manual_input.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find Tema 15 block up to Tema 16 block or end of file
# Current structure: ... Tema 14 ... Tema 15 ... Tema 16 ...
# We want to replace everything from "Test n.º 15" until "Test n.º 16"
pattern = r"(Test n\.º 15:.*?)(Test n\.º 16:)"

# Strip nonsense from new data (+1 lines)
cleaned_lines = []
for line in new_tema_15.splitlines():
    if line.strip().startswith('+') and line.strip()[1:].isdigit():
        continue
    cleaned_lines.append(line)
cleaned_tema_15 = '\n'.join(cleaned_lines) + '\n\n'

# Check if Tema 16 exists in file
if "Test n.º 16:" in content:
    # Replace ONLY Tema 15 block, keeping headers
    new_content = re.sub(pattern, f"{cleaned_tema_15}\\2", content, flags=re.DOTALL)
else:
    # If Tema 16 isn't found (unlikely), just append or replace from 15 onwards
    # But we saw 16 in previous viewing, so it should be there.
    # We'll use a specific indicator just in case
    start_15 = content.find("Test n.º 15:")
    if start_15 != -1:
        new_content = content[:start_15] + cleaned_tema_15
    else:
        new_content = content + "\n\n" + cleaned_tema_15

with open('manual_input.txt', 'w', encoding='utf-8') as f:
    f.write(new_content)
