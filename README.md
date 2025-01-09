# Ink Catiction
Juego competitivo donde dos gatos luchan por pintar más terreno que su rival en una competición por hacerse con la corona del reino.

Trabajo desarrollado para la asignatura de _Juegos en Red_.
## Equipo:
- Pablo Quiñones Gonzalez -> @ThatBit345 -> p.quinones.2022@alumnos.urjc.es
- María Marquez García -> @martesytrece -> m.marquezg.2022@alumnos.urjc.es
- Sara María Romero Bermejo -> @SaraRomBer -> sm.romero.2022@alumnos.urjc.es
- Samuel Retamero Salado -> @Samuelovich -> s.retamero.2022@alumnos.urjc.es

# Compilación y ejecución
Para compilar el projecto se necesita un JDK de Java 17.

## Windows
Para ejecutar el juego en Windows los pasos son:
1. En la carpeta raíz, utiliza el siguiente comando para compilar el proyecto: `./mvnw.cmd package`
2. Una vez compilado, en la carpeta target, utilizar este comando para abrir el servidor: `java -jar ink-catiction-0.0.1-SNAPSHOT.jar`
3. En el navegador, acceder con la dirección IP del servidor y el puerto 8080, por ejemplo, la dirección `127.0.0.1:8080` para acceder desde el ordenador que tiene el servidor abierto.

# GDD
## Historial de versiones
El documento de diseño es un elemento vivo que evoluciona junto con el juego. En este apartado se verán reflejados los cambios más relevantes realizados en el mismo respecto a sus distintas versiones.
- V1.0 22/10/2024: Versión inicial del GDD
- V2.0 26/11/2024. 
	- Añadidos los contenidos clasificación de edad, la licencia de uso y monetización al apartado de Introducción
	- Añadidas las imágenes de arte de personajes, paletas y _sprites_ a sus respectivos apartados
	- Añadidas las nuevas versiones de las interfaces
 	- Correcciones menores en el documento respecto a la anterior versión 
- V3.0 19/12/2024. 
	- Ampliación y corrección del apartado de efectos de sonido
 	- Actualización del diagrama de estados y adición del diagrama de clases
  	- Actualización de imágenes
  	- Instrucciones de uso del servidor
- V4.0 10/01/2025
	- Añadido un apartado de implementación mediante WebSockets
	- Actualización del diagrama de clases con WebSockets
	- Revisión y corrección final

## Introducción

### Motivación
El surgimiento de los juegos en línea ha supuesto un antes y un después en la historia de los videojuegos, marcando así tendencias y hábitos de los jugadores. Este fenómeno ha cobrado una especial importancia, siendo que según un estudio realizado a principios de 2024 por Statista, calcula que el 93% de los jugadores juegan en línea, por lo que merece la pena detenerse a reflexionar y aprender acerca del formato de juego más común de la industria. El objetivo de esta práctica será, por lo tanto, desplegar un proceso de diseño y desarrollo que permita crear un videojuego en red que pueda conectar a dos usuarios desde distintos dispositivos.

A lo largo de las cuatro fases de la práctica de Juegos en Red el equipo de desarrollo *MoMo Studios* se encargará de traer a la vida *Ink Catiction*, un videojuego de acción inspirado en *Splatoon*. A continuación se muestra el documento de diseño de dicho videojuego, donde se desarrollan todos los contenidos que se pretenden plasmar en la entrega final.

### Concepto
*Ink Catiction* es un videojuego en el que los jugadores tendrán la oportunidad de ponerse en la piel de distintos felinos combatientes, cuyo objetivo es competir contra otros gatos y dominar el campo de batalla usando el poder de la tinta como arma, para así convertirse en los campeones del reino.

El título cuenta con las siguientes características principales:
- **Mecánicas variadas:** cuenta con mecánicas inspiradas en *Splatoon*, como la condición de victoria de aquel jugador que haya pintado una mayor zona de la pantalla, así como mecánicas originales que le darán más personalidad al juego.
- **Uso del modelo cliente/servidor**, ya que está pensado para ser jugado desde dos máquinas distintas conectadas a la misma red que acceden al juego que se encuentra almacenado en otro dispositivo que actúa de servidor.
- **Uso del framework Phaser 3** para desarrollar el videojuego mediante Javascript.
- Uso de la interfaz de programación **REST** y uso del protocolo de comunicación WebSockets.

### Género
*Ink Catiction* es un juego de acción en formato multijugador competitivo en el que dos jugadores deberán enfrentarse y tomar todo el control de un territorio posible. Tiene diferentes aspectos de juegos de estrategia, como el uso de potenciadores que habrá repartidos por el mapa.
### Público objetivo
Al ser un juego sencillo de jugar disponible a distintos grupos, el equipo se ha centrado en un público más joven, reflejado en el uso de colores brillantes que retenga más su atención, entre otros. El hecho de que el juego esté destinado a un público joven no impide que otros también lo jueguen, como en un ambiente familiar, por lo que debe mantener una experiencia ligera y entretenida.

Según la clasificación europea PEGI, este videojuego se encontraría dentro de la categoría con la etiqueta PEGI 7, siendo que el juego contiene escenas o sonidos que pueden atemorizar a niños pequeños y existe cierto grado de violencia, aunque esta no se encuentra representada de forma realista ni explícita. En el sistema análogo norteamericano se clasificaría como ESRB Everyone 10+.
### Monetización
El equipo de desarrollo planea lanzar una versión de este juego a la plataforma itch.io de manera gratuita para abarcar una mayor cantidad de público. Sin embargo, se ofrecerá la posibilidad de realizar una donación para apoyar a los creadores por el precio que el adquisidor desee, aunque la cantidad de la donación recomendada será 2.00€. Se considera también la posibilidad de añadir contenido adicional (personajes, mapas, modos de juego) y crear una versión final en caso de que el juego sea lo suficientemente exitoso, pudiendo convertirlo en un producto que se adquiera mediante un pago único de entre 5.00 a 10.00€.

Tampoco se descarta la posibilidad de emplear métodos de monetización que no provengan directamente del videojuego, pudiendo crear merchandising o arte promocional que se pueda vender en forma de pósters o peluches de los personajes del juego.
### Licencia de uso
Ink Catiction tiene una licencia Apache 2.0, por lo que se permite modificar, redistribuir y utilizar el código con fines tanto comerciales como no comerciales siempre y cuando se incluya un aviso de licencia Apache.
### Historia
El juego no tendrá un contenido narrativo amplio, ya que no forma parte del género del videojuego. Sin embargo, para situar al jugador en un mundo lúdico narrativo sí que se implementará una pequeña historia para crear el contexto del videojuego.

La narración de *Ink Catiction* está centrada en los conflictos que surgen entre distintos felinos territoriales, que combatirán en un torneo por reclamar la propiedad de un reino. Estos gatos pelearán en espacios preparados para el combate, donde deberán ir dejando trazos de tinta para marcar el terreno de su propiedad. Los protagonistas deberán combatir entre sí para, no solo pintar la mayor zona del patio posible, sino para evitar que el adversario les arrebate su puesto por conseguir la corona.

## Diagrama de clases de la aplicación
La implementación de las clases que han permitido un correcto funcionamiento del servidor se han reflejado en un diagrama cuya distinción de clases viene dada por una leyenda de colores. Adicionalmente se ha modificado para incluir la parte de WebSockets: 

![UML_ink](https://github.com/user-attachments/assets/e06d3746-5058-46ae-94ea-474a272eb9c4)

## WebSockets
Se ha generado una versión del juego _online_ mediante el protocolo de comunicación bidireccional WebSockets. En la siguiente lista se detallan las siguientes funcionalidades implementadas para el protocolo:

### Comunicación del lobby
**- Inicialización del lobby (ID:I):** mensaje enviado por el servidor a los clientes cuando un lobby es creado.
**- Jugador listo (ID:Y): **mensaje enviado por el cliente al servidor cuando el mismo selecciona un personaje, para luego ser enviado al otro cliente. En este mensaje se envían tanto el personaje seleccionado como el id del jugador.
**- Cierre de lobby (ID:L):** se envía por el servidor cuando el lobby de cierra debido a cualquier motivo.

### Comunicación del juego
**- Inicialización (ID:G):** mensaje enviado por el servidor para iniciar el estado del jugador, cuando los clientes envían un _packet_ para asegurar que la inicialización está hecha. Se envían los siguientes elementos:
	- **Id:** identificación del jugador que será reutilizada posteriormente en otras partes del protocolo.
 	- El personaje seleccionado por el jugador.
  	- Posición inicial del jugador.
   	- De la misma manera se envían el personaje seleccionado por el jugador contrario y su posición inicial.
    	- Información inicial de los Power Ups.
     
#### Comunicación de datos relativos al jugador
**- Posición (ID:P):** se envía desde el cliente hasta el servidor para actualizar la posición del personaje en coordenadas 2D (x, y), mientras que el servidor se encarga de enviarlo al otro cliente junto con el id del jugador.
**- Ataque (ID:A):** enviado por el cliente al servidor cuando en jugador se encuentra atacando, el servidor lo envía al cliente contrario para actualizar las animaciones. Adicionalmente, el servidor también se encarga de comprobar el daño ingligido al jugador contrincante.
**- Muerte (ID:D):** es enviado por el servidor a ambos clientes cuando alguno de los jugadores muere. Transfiere el id del jugador cuyo número de vidas llegó a cero.
**- Reaparición (ID:R):** caso similar al anterior, este mensaje de envía cuando un jugador reaparece (tras morir). También transfiere el id del jugador que reapareció.

#### Comunicación de datos relativos a los PowerUps
**- Aparición de PowerUps (ID:S):** se envía por el servidor cada vez que un Power Up aparece en el mapa. Se envían sus coordenadas de aparición en 2D (x, y) y su tipo (en función de si es de velocidad, fuerza o bomba de pintua).
- Recolección de PowerUps (ID:C): se envía por el cliente cada vez que el jugador recoge un PowerUp. El servidor se encarga de comprobar si es correcto y el tipo de PowerUp recogido, para después actualizar ambos clientes. El cliente envía el id del jugador que recogió el PowerUp mientras que el servidor se encarga de enviar el id y adicionalmente la posición en 2D (x, y) del PowerUp para eliminarlo en el lado del cliente.
**- Consumo de PowerUp (ID: O):** mensaje enviado por el servidor una vez que se supera la duración de los efectos de un PowerUp recogido por un jugador (se llama únicamente para los PowerUps de velocidad y fuerza). El servidor envía el id del jugador que agotó el PowerUp.

-** Tiempo (ID:T):** el servidor envía la cantidad de tiempo restante de una partica cada vez que el tiempo avanza.
**- Finalización de partida (ID:F):** el servidor envía los resultados de ambos jugadores (número de celdas que pintaron y número de veces que eliminaron al contrincante) junto con los personajes seleccionados por cada uno cuando el tiempo de partida se acaba.

## Jugabilidad
### Mecánicas
En esta sección se explica detalladamente los controles que se emplean en el juego así como otros aspectos de la jugabilidad como pueden ser los potenciadores o las condiciones de victoria y derrota. Como puntualización adicional, el juego no contará con niveles progresivamente más complicados ni una curva de dificultad definida, puesto que por el tipo de juego que es, estos aspectos vienen determinados por el nivel de habilidad del jugador y de su oponente y no del videojuego.

El movimiento de los personajes se realizará en cuatro direcciones, y vendrá determinado por los siguientes controles:
- **Movimiento en modo local**: en el caso de juego en local, los jugadores podrán usar las combinaciones de teclas “WASD”, para el jugador uno, y las teclas de las flechas “↑←↓→”, para el jugador dos, para desplazarse por la pantalla de juego e ir pintando aquellas zonas por las que pasa.
- **Movimiento en modo en línea**: en el juego en red ambos jugadores usarán la combinación de teclas “WASD” desde cada uno de sus dispositivos. Se considera la posibilidad de añadir controles por mando.
#### Ataques
Los jugadores podrán lanzar ataques básicos a melé pulsando las teclas correspondientes. Los ataques del jugador uno se activarán con la tecla “E” y los del jugador dos se podrán usar al pulsar la tecla “Shift right”. Para poder llevar a cabo un ataque exitoso requerirán que el jugador atacante se posicione en una de las casillas vecinas a las del jugador atacado.

**Barra de resistencia:** para evitar modificar el propósito del juego se incluirá una barra de resistencia que reduzca el número de ataques que puede hacer el personaje. De esta manera los jugadores no podrán hacer más de 3 ataques seguidos. Si al realizar una acometida el atacante no está cerca del atacado entonces la vida del objetivo no se verá afectada pero la barra de resistencia del emisor de la ofensiva sí se verá negativamente afectada.
### Condición de victoria
Cada partida tiene una duración de tres minutos, y se considerará ganador a aquel que tenga más casillas pintadas de su color al finalizar la cuenta atrás. En caso de empate por el número de casillas pintadas, gana el que haya eliminado un mayor número de veces al jugador contrario.
### Condición de derrota
La condición de derrota es la opuesta a la condición de victoria, pierde el jugador que menos casillas haya sido capaz de pintar en el tiempo delimitado. En caso de empate, pierde el que haya sido eliminado un mayor número de veces por el jugador contrario. La eliminación (muerte del personaje) no conlleva la derrota de la partida pero sí una penalización estratégica.
### Objetos
#### Power Ups
En el mapa se distribuirán una serie de *Power Ups* que aparecerán aleatoria y esporádicamente en puntos accesibles para ambos jugadores. Dichos *Power Ups* aportarán ventajas de distintos tipos que permitirán una experiencia de juego más variada así como un mejor control del mapa en caso de ser utilizados apropiadamente. Se distinguen los siguientes tipos:
- **Aumento de velocidad:** el personaje recibe un bonificador que aumenta su velocidad durante 5 segundos, pudiendo abarcar más zonas del tablero.
- **Ataques ilimitados:** el jugador recibirá por 5 segundos un número ilimitado de ataques que no afectará a la barra de resistencia.
- **Bomba de pintura:** se produce una explosión que cubre de tinta todo lo que hay alrededor del jugador en un radio determinado, pintando de una sola vez una mayor zona del mapa.
<img width="1599" alt="power ups" src="https://github.com/user-attachments/assets/47f7369c-6c55-426c-ab74-e9ce256d546b">

## Mapas
El espacio consta de una dimensión en 2D con una estructura tipo mapa de baldosas. Este espacio estará limitado al espacio de la pantalla, y el POV que tendrán los jugadores del mapa será de una cámara 2D en perspectiva cenital, con las sprites representadas en picado para una mejor legibilidad de los personajes. 

El juego contará con varios mapas jugables y diferenciados entre sí, los cuales serán elegidos al azar al comienzo de la partida. Se ha actualizado el mapa **Catacumbas de las ánimas** y se ha añadido el nuevo mapa **Bosque fantasía:*:
- **Catacumbas de las ánimas:** a esta prisión se destinaban todos aquellos individuos que interrumpían la paz del reino de forma indiscriminada, condenándolos a un encierro en la profunda oscuridad por el resto de sus vidas. Sin embargo, una fuerza misteriosa echó abajo la estructura, convirtiéndola en unas catacumbas que ahora se usan como arena de combate callejera.

![Mapa_catacumbas](https://github.com/user-attachments/assets/b2e69271-10a0-4f7e-a2d1-64bbb5714ecf)

- **Bosque fantasía:** Colorido bosque en el que habitan criaturas fantásticas y la magia abunda allá por donde se pisa. En este lugar se refugian aquellos felinos que buscan una vida animada pero alejada del ruido de la ciudad.

![Mapa_bosque_fantasia](https://github.com/user-attachments/assets/66549cce-3f4a-4c93-8b49-ad1bd83158f0)

Se espera implementar el siguiente mapa:
- **Estadio victorioso:** este estadio se ubica en el mismo centro de la ajetreada ciudad, y la cantidad de grandes eventos que se celebran en él hace de este lugar un espacio memorable en el que sólo los mejores combatientes pueden dar a conocer su espectáculo en el campo de batalla.

Tanto la estructura como los bocetos de diseño se implementará en las siguientes fases del desarrollo.
## Personajes
Todos los personajes de Ink Catiction son gatos, como indica el nombre. Se harán distintos tipos de gato para cada color. Esta decisión se ha llevado a cabo para que a los jugadores les resulte más fácil diferenciar a sus personajes en la pantalla. A continuación se muestran las descripciones que han permitido realizar un *concept art* de los personajes, que se convertirán en *sprites*.

![all_cats](https://github.com/user-attachments/assets/56dc3c88-671a-42e5-b699-8494d493e9cc)

A continuación se muestra el arte de los personajes en orden de descripción respectivamente.

- **Gato magenta:** “*Ágata* es una gata calicó pastelera a la que le encantan las fresas. Tiene un carácter cariñoso y amistoso que invita a iniciar una amistad, sin embargo, le lanzará una tarta de fresas recién sacada del horno a todos aquellos que le intenten hacer daño a ella o a cualquiera de sus amigos. Tiene un sombrero con forma de fresa. La tinta que utiliza está hecha de una crema pastelera especial que se queda pegada allá por donde cae.” 
- **Gato amarillo:** “*Frankcatstein* es un gato grisáceo de origen desconocido. Las partes de su cuerpo están unidas de una forma extremadamente macabra, como si de un muñeco hecho de piezas de otros juguetes se tratase. Este felino tiene una incontrolable sed de caos que se sacia únicamente cuando saborea la derrota de sus enemigos. Su accesorio especial es un cono de prevención que su creador utilizó para evitar que se arrancase partes de su propio cuerpo. El rastro de tinta amarilla que va dejando a su paso no es más que el combustible filtrado que su cuerpo utiliza para funcionar correctamente.”
- **Gato cian:** “*Gwynn* es un gato tuxedo y el fan número uno de la limpieza de baños. Tiene un carácter robusto y estricto. Se dedica a limpiar todos los restos de tinta que otros combatientes dejan por ahí, lo que le ha ganado bastantes enemigos. Utiliza una mezcla de limpiadores muy potentes y corrosivos a la piel como tinta, lo que puede provocar intoxicación a sus enemigos. Su accesorio especia es un gorro de limpieza y dos pared de guantes de color cian.”
- **Gato azul:** “*Stregobor* es un gato siamés anciano y uno de los hechiceros más reconocidos del reino. Tiene un carácter tranquilo y tiende a sopesar mucho las posibles soluciones para resolver sus problemas, por lo que no suele recurrir al conflicto a no ser que sea estrictamente necesario. Su accesorio identificativo es un sombrero puntiagudo azul de mago y una capa del mismo color. La tinta azul que utiliza proviene de las pociones mágicas cuya receta se ha esmerado en perfeccionar desde su juventud.”
- **Gato naranja:** “*Sardinilla* es un gato naranja y, como los demás gatos de este tipo, es muy activo y tiene momentos de locura espontáneos. Su perfil hiperactivo encaja muy bien con la ajetreada vida de la ciudad, por lo que se retiró a la *miautrópolis* a trabajar como agente de obras. Su accesorio más llamativo es un cono de tráfico naranja reflectante que lleva puesto en la cabeza, junto con un chaleco del mismo color. Su tinta naranja son los cientos de litros de pintura que encargó por error para pintar su casa, y que ahora tiene que gastar en algo mejor.”
- **Gato morado:** “*Yenna* es una gata esfinge muy solitaria que ha dominado el arte de la brujería. Tiende a maldecir con sus hechizos chamánicos a todos aquellos que la molestan, ya que es fácilmente irritable. Su accesorio especial es una calavera  de cuervo teñida de morado que lleva como casco. La tinta morada que emplea en combate es el resultado de los torrentes de magia negra que salen despedidos de sus manos cuando conjura un hechizo.”

<img width="1599" alt="cats" src="https://github.com/user-attachments/assets/970d54f0-e923-4f6b-9107-1f2b1460dc5a">
_Bocetos de los personajes jugables_

## Estilo visual
*Ink Catiction* contará con un estilo de arte tipo *Pixel Art*, con una resolución aproximada de 32px. Será de una estética simple debido al reducido tiempo disponible para el desarrollo del videojuego pero con posibilidad de un mayor desarrollo en el apartado de diseño en un futuro. A continuación se muestran ejemplos de algunos ciclos de animación creados para los personajes, como el idle de Ágata o el ciclo de carrera de Frankcatstein:

![ejemplos_animaciones_personajes](https://github.com/user-attachments/assets/8553663a-f6fd-4663-abc1-291b124d03f7)

En la selección de paletas de colores se hace especial hincapié en el color de las tintas. Se ha optado por colores llamativos y bien diferenciados entre sí con el fin de que las zonas pintadas por cada personaje queden claramente delimitadas entre sí. Es por ello que los jugadores podrán escoger los sets de pintura que deseen dentro de una paleta preestablecida, sin que ambos jugadores puedan elegir el mismo color para la misma partida. Esta selección del color pintura viene determinada por el personaje que se haya seleccionado. Se espera implementar los siguientes seis tipos de tintas, de las cuales ya se han implementado la amarilla y la magenta: 

![colores_de_tintas](https://github.com/user-attachments/assets/6ebebc4c-3c0e-4113-807c-461e6c9fbbdc)

### Arte 2D
Se espera que las imágenes utilizadas sean de elaboración propia, aunque este aspecto puede estar sujeto a cambios en función de las capacidades del equipo. Los elementos artísticos 2D que deberán estar presentes en la versión final del juego son los siguientes:
- *Logo*: un logo con el nombre *Ink Catiction* representado con un estilo de fuente de letra similar a la fuente de letra *Metamorphous*. Los colores estarán especificados en la sección de la paleta de colores.
- *Splash art principal*: una pieza de arte que tenga elementos relevantes y contextuales de la temática del juego para facilitar al jugador entender ligeramente la idea del sin necesidad de tenerla por escrito. U
- *Arte de previsualización*: cada uno de los personajes (seis en total) deberá tener un dibujo en 2D donde se pueda ver claramente el personaje completo. Este arte se utilizará en el menú de selección de personajes para que el jugador pueda tener una vista detallada de cómo es el personaje que va a jugar.
- *Icono de previsualización*: cada uno de los botones de selección de personaje deberá tener un icono (que bien puede ser un recorte de la cara del personaje del arte de previsualización o un icono nuevo) que permita a los jugadores poder distinguir las opciones de personajes que habrá en el panel.
- *Arte de personaje*: cada personaje contará con sprites animados en estilo Pixel Art. El arte de personaje cuenta con las siguientes animaciones que permitirán una mejor retroalimentación:
	- *Animación de movimiento del personaje.*
	- *Animación de ataque del personaje*.
	- *Animación de muerte*.
	- *Animación de potenciamiento (tras obtener un Power Up)*.
	- *Animación de idle (opcional).*
 Se han añadido las siguientes animaciones adicionales:
	- *Animación tras recibir un golge*.
	- *Animación de reaparición (opcional)*.
	- *Animación de desaparición (opcional)*.
 Ejemplo de spritesheet hecha con las animaciones mencionadas en la lista:

![agata_spritesheet_example](https://github.com/user-attachments/assets/57ccd709-40b1-4fde-91f1-8cf6a1cd152e)

#### Arte descartado
En el proceso de diseño de la estética final, se ha creado arte que ha sido descartado por no cumplir con la consistencia, pero que se pretende reciclar para crear el arte de la portada en futuras entregas.

![main_art-placeholder](https://github.com/user-attachments/assets/9ea74a6f-b07b-4325-8518-ca19397153be)

Elementos de aparición **opcional** pero pueden ayudan a enriquecer la experiencia visual del juego:
- *Splash art alternativo*: piezas de arte que representen situaciones del juego y que se puedan utilizar como fondo en algunas pantallas de las interfaces.
- *Arte de victoria*: cada personaje podrá contar con una ilustración en 2D que represente a los mismos en una pose victoriosa.
- *Arte de derrota*: mismo que en el arte de victoria pero en una pose de derrota.
## Interfaces
En este apartado se refleja todo el proceso que los jugadores podrán llevar a cabo a la hora de interactuar con el juego en cada momento. Al iniciar el juego se presentará un *Menú Principal* que podrá conducir a una partida, a un *Menú de Ajustes*, o bien de vuelta al sistema operativo. Si se selecciona la opción de juego, se deberá elegir el tipo de conexión y posteriormente los personajes con los que se va a realizar la partida. A partir de aquí se genera el Game-Loop del juego donde se realizan tres rondas en las que los jugadores reaparecen de forma infinita cada vez que son eliminados hasta que se acaba el tiempo. Una vez completadas las tres rondas, se determina el ganador dando paso a los mensajes de victoria y derrota, y ofreciendo la opción de regresar de nuevo al *Menú Principal*, donde se puede repetir este mismo proceso de nuevo.

El conjunto de interfaces que existirán en el videojuego se relacionarán entre sí de acuerdo con el siguiente diagrama de flujo que se ha actualizado para la tercera entrega con las nuevas pantallas de registro y chat:

![diagrama flujo_actualizado](https://github.com/user-attachments/assets/f1f60969-0b47-436b-8719-536f082e3b0f)

A continuación se mostrarán los bocetos y conceptos iniciales de las interfaces con las que el usuario podrá interactuar en el juego. Estos bocetos están elaborados en escala de grises, de tal manera que sólo representan los elementos interactivos relevantes y no representan los colores finales que se utilizarán en el juego. Estos bocetos pueden no representar la estructura final, puesto que el equipo podrá realizar ajustes de las mismas en función de las necesidades del diseño. Junto a los bocetos se incluye la interfaz implementada para la segunda entrega.

### Pantalla de Registro e Inicio de sesión

![acceso_cuenta](https://github.com/user-attachments/assets/a3e25ca9-ccb2-49f0-a6ac-0a55afbe0676)

Esta pantalla no se tuvo en cuenta en la primera entrega, por lo que no se mostrará un boceto de la misma, únicamente el resultado final. Esta deberá contar con los siguientes elementos:
- Botón *Login* que permita a los usuarios ya registrados iniciar sesión.
- Botón *Register* donde los nuevos jugadores podrán registrarse.
- Dos áreas o campos tipo formulario que el usuario pueda rellenar con los nombres "*game*" y "*password*" para iniciar sesión.
- Una imagen artística 2d tipo *splash art* que también se utilizará en el Menú Principal.

### Pantalla de chat

![chat](https://github.com/user-attachments/assets/10f028e3-4f08-4ea0-9ca3-30e077b966af)

Esta pantalla también es una implementación de la tercera entrega, por lo que sólo cuenta con una versión final. Contará con los siguientes elementos:
- Área de mensajes en la que se podrán visualizar tanto los mensajes propios como los mensajes enviados por otros usuarios que también se encuentren conectados.
- Área de escritura donde el usuario podrá escribir mensajes que podrá intercambiar con otros usuarios que se encuentren conectados al servidor.
- Botón *Send* que permita a los usuarios mandar mensajes al chat.
- Indicador del número de usuarios que se encuentran conectados al chat.
- Botón *Back* que permita que el usuario se desconecte del chat y regrese al Menú Principal.

### Pantalla de Menú Principal

![menu principal](https://github.com/user-attachments/assets/0fc19040-3e92-489f-bb2a-5b548fe5abca)

![menu_principal implementado](https://github.com/user-attachments/assets/11569ea4-239c-40d2-a786-b6432f6976fc)

Esta pantalla contará con los siguientes elementos:
- Botón *Jugar*, que conducirá a la *Pantalla de Selección de Tipo de Conexión*.
- Botón *Ajustes*, que conducirá a la *Pantalla de Configuración*.
- Botón *Créditos* que muestre los nombres de los autores del juego.
- Una imagen artística 2d tipo *splash art* que sirva como portada de presentación del juego.
- Se debe incluir la versión en la que se encuentra el juego.

![imagen](https://github.com/user-attachments/assets/1783f33d-d46b-49e6-a9b3-ec39fbc1492d)

Esta pantalla ha sufrido cambios debido a la adición de las siguientes mejoras:
- La imagen 2d varía aleatoriamente para mostrar a los distintos personajes jugables.
- Botón *Chat* en caso de estar utilizando el modo online para poder comunicarse con otros jugadores.
- Botón *Tutorial* que conduce a una pantalla con una explicación básica de controles para el modo local.

### Pantalla de Selección del tipo de conexión

![tipo de conexion](https://github.com/user-attachments/assets/40ab20a7-0538-41bd-959e-143e16847f92)

![tipo_de_conexion_implementado](https://github.com/user-attachments/assets/483c2d83-2b5a-4172-bb74-067f0e16b148)

Esta pantalla contará con los siguientes elementos:
- Botón *Juego local* que conduzca a la *Pantalla de Selección de Personajes*. 
- Botón *Juego en línea* que conduzca a la *Pantalla de Selección de Personajes*.
- Botón *Volver* que devuelva al jugador al *Menú Principal*.
- Una imagen artística 2d tipo splash art que bien puede ser la utilizada en el *Menú Principal* o una versión alternativa de la misma.

### Pantalla de Selección de personajes

![seleccion de personajes](https://github.com/user-attachments/assets/aa155bf4-cc37-46f3-bb70-dbbda7f8aa49)

![seleccion_de_personajes_implementado](https://github.com/user-attachments/assets/bdaf098e-410e-4a82-bf44-35fada50a40d)

La *Pantalla de Selección de Personajes* contará con los siguientes elementos:
- Un panel de seis botones que contienen iconos de los personajes jugables. Una vez que un jugador haya seleccionado y fijado un personaje, el botón correspondiente al personaje quedará inutilizable para el segundo jugador (se deberá representar mediante una sprite de botón desactivado).
- Un panel para el Jugador 1 que contará con una sprite detallada del personaje y el nombre del mismo. El personaje seleccionado se mostrará mirando en dirección al centro de la pantalla. 
- Otro panel con las mismas propiedades que el anterior para el Jugador 2.
- Un botón *Listo* que fija la selección de personaje para cada jugador. 
- Un botón *Volver* que regrese al *Menú de Selección de Tipo de Conexión*.
- Un fondo artístico en 2D que represente algún escenario o mapa presente en el juego.

### Pantalla de Juego

![juego](https://github.com/user-attachments/assets/dad9fa4f-1f80-404c-82a2-9a2c9b2a441f)

![juego_implementado](https://github.com/user-attachments/assets/68db30a4-23a9-4fe7-9d45-4b607748e958)

En esta pantalla se mostrarán los siguientes elementos:
- Panel de las vidas correspondientes para cada jugador, que estarán representadas por tres instancias de un icono (ej: corazones). Cuando un personaje reciba un golpe, uno de los iconos aparecerá vacío.
- Barra de resistencia que se drenará progresivamente cuando se realicen varios ataques seguidos.
- Círculo hueco en el que aparecerá el icono del potenciador que recoja el jugador en un momento dado. El círculo se quedará hueco de nuevo una vez se acabe el efecto del potenciador.
- Temporizador que marque el tiempo restante hasta que se acabe la ronda (en minutos).
- Panel con un contador situado bajo el temporizador que marca la victoria de cada jugador en función de la ronda (por ejemplo, si un jugador que utiliza el personaje de tinta azul gana la ronda 1 se mostrará el primer círculo del panel iluminado del mismo color).

### Pantalla de Configuración

![configuracion](https://github.com/user-attachments/assets/a37041ef-9ff7-45a7-aa0e-630e07f5089d)

Este boceto representa vagamente la idea de cómo debería ser la pantalla de configuración, compuesta por tres desplegables para las categorías: general, audio y vídeo. En el boceto se muestran tres ejemplos de ajustes genéricos que se podrán emplear en los ajustes, como por ejemplo pueden ser los sliders o los botones. En este caso, la selección de los ajustes más apropiados queda a cargo del apartado de programación.

![configuracion_implementado](https://github.com/user-attachments/assets/82649e4f-7a86-47a8-8a33-e49ff1a7f477)

A continuación se muestra la implementación realizada por el equipo de programación. Por el momento sólo se ha considerado necesario permitir que el jugador pueda controlar su volumen, aunque más adelante se plantea la posibilidad de añadir otros ajustes de personalización. Por otro lado, también se han añadido las siguientes funcionalidades:
- Sección *Cuenta*: contiene aquellos ajustes de gestión de usuarios que pueden ser modificados por el jugador.
	- Un campo de texto acompañado de un botón *Cambiar* que permita modificar la contraseña en caso de haber iniciado sesión.
	- Un botón *Borrar Cuenta* que permita eliminar la cuenta del usuario.
- Un botón *Volver* que permita regresar al *Menú Principal*.

### Pantalla de  Tutorial
Pantalla informativa que muestra visualmente los controles básicos asignados a cada jugador en el modo local
- Botón *Volver* que permite regresar al Menú Principal.

![imagen](https://github.com/user-attachments/assets/caad56a5-dbae-43e4-99e0-591636753354)

### Pantalla de Resultados

![resultados](https://github.com/user-attachments/assets/9870232e-0cdc-4cc8-b831-348e45352a03)

Este boceto representa cómo se vería la pantalla final tras finalizar el juego, con los siguientes elementos:
- Un mensaje de victoria y derrota, según se haya ganado o perdido.
- Una *sprite* de victoria o derrota del personaje utilizado, según se haya ganado o perdido.
- Un panel con datos curiosos o relevantes de la partida. En el boceto se muestran los siguientes, pero la elección final queda a cargo del apartado de programación.
- Un botón *Volver*, que devuelve al jugador al *Menú Principal*.

Por el momento se ha implementado la pantalla que se muestra a continuación, aunque se espera añadir más elementos propuestos en el boceto en futuras entregas.

![resultados_implementado](https://github.com/user-attachments/assets/05b7fae7-9aab-413e-9262-29bfc098b551)


En caso de que la partida haya sido jugada en multijugador local, la pantalla se dividirá en dos y se mostrará una versión comprimida de dicha pantalla con las estadísticas de cada jugador en sus respectivas mitades:

![resultados partidos](https://github.com/user-attachments/assets/7a8e517e-5e6a-4b90-9af6-77478fde4d26)

### Paleta de colores

Para la paleta de colores a usar en este videojuego se ha optado por un conjunto de tonalidades en las que se puede destacar la calidez de la mayoría de sus componentes. Esta combinación ayuda a reflejar más fielmente la tonalidad del videojuego, siendo una obra poco seria y abierta a todos los públicos.
## Sonido

### Banda sonora
Durante toda la partida se incluirán distintas bandas sonoras para añadir ambientación a la escena. Se proponen los siguientes ejemplos para las variadas bandas sonoras que se emplearán en los escenarios del videojuego:
- **Banda sonora del menú principal:** la banda sonora del menú de inicio debe ser alegre, para animar al jugador a iniciar una partida, y tranquilo ya que no debe de provocarle al participante ningún tipo de agobio o nerviosismo.
- **Banda sonora de la pantalla de juego:** la canción que se reproducirá en esta pantalla deberá ser una versión más animada de la banda sonora del menú principal. Esto es debido a que sí que se requiere una mayor tensión entre los jugadores durante el tiempo que dure la partida. 
- **Banda sonora de victoria:** esta música debe ser alegre ya que le debe indicar al jugador la victoria de la partida, sin embargo, no tiene que ser tan alegre como para que el jugador se vuelva arrogante. Esta banda sonora también deberá animar al jugador a jugar de nuevo.
- **Banda sonora de derrota:** la música que se plantea emplear en esta pantalla es una música con un tono triste debido a que tiene que mostrarle al jugador que el juego no ha acabado bien, pero también tiene que tener un tono animado para que el jugador quiera volver a jugar al videojuego y, de ese modo, darle esperanza de que pueda ganar la siguiente partida.
### Efectos de sonido
Para mejorar la experiencia lúdica de los jugadores se incluirá retroalimentación mediante sonidos a lo largo de toda la partida e incluso en los propios menús del juego. Estos efectos han sido y serán creados mediante la herramienta 'SFXR' Se propone incluir los siguientes efectos sonoros en el videojuego:
**Efectos de interfaz:**
- ***Efecto al presionar un botón:*** este sonido deberá de ser breve y no muy llamativo ya que este debe de ser suficiente para que el jugador entienda que ha llevado a cabo la acción, pero sin sacarlo demasiado del juego.
- **Efecto al comenzar una partida:** se reproducirá durante la cuenta atrás y emitirá un pitido o sonido llamativo cuando la partida comience.
- **Efecto al finalizar la partida:** se emitirá acompañando a la animación de *Game Over* cuando la cuenta atrás llegue a cero, señalizando el fin de la partida.
**Efectos de partida:** aquellos efectos de sonido que se reproducirán durante el tiempo de juego.
- ***Efecto al atacar:*** se usarán dos sonidos distintos para los ataques a melé, diferenciándose dependiendo de si el atacante ha afectado al atacado o si no.
	- ***Ataque exitoso:*** este sonido debe ser breve y sonar grave, representando que se ha golpeado algo exitosamente.
	- ***Ataque fallido:*** este sonido debe ser breve y sonar similar a una ráfaga de aire.
- **Efecto al recibir daño:** emite un sonido similar al de los juegos 8-bit cuando un personaje recibe un golpe.
- ***Efecto al obtener Power Ups:*** se emitirá un sonido que indicará que se ha obtenido uno de estos. Este efecto sonoro que será el mismo para todos los tipos de *Power Ups.*
- **Efectos de *Power Ups:*** se reproducirán mientras dure el *Power Up* para enfatizar la distinción entre los distintos tipos.
	- ***Efecto de aumento de velocidad:*** debe ser animado y recordar a la música que suena en títulos como *Mario Bros* cuando se obtiene un *Power Up* de *Estrella*. 
	- ***Efecto de ataques ilimitados:*** debe emitir un sonido que recuerde al afilado de un arma.
	- ***Efecto de bomba de pintura:*** debe imitar el sonido de una explosión.
### Anexo
- **Música de fondo de partida:**  8-Bit Music On by moodmode (https://pixabay.com/music/video-games-8-bit-music-on-245249/)
