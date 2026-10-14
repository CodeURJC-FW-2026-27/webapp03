# SuperTrip - Guía de Destinos y Experiencias

## Integrantes del equipo de desarrollo
* **Adrián Varea Fernández** - a.varea.2023@alumnos.urjc.es - GitHub: [blodresg](https://github.com/blodresg)
* **Salvador Barquilla Cedillo** - s.barquilla.2025@alumnos.urjc.es - GitHub: [SalvaB14](https://github.com/SalvaB14)
* **Sergio Abueitah Cantero** - s.abueitah.2025@alumnos.urjc.es - GitHub: [SergioAbueitah](https://github.com/SergioAbueitah)

## Funcionalidad

### Entidades (Relación Conjunto - Partes)

* **Entidad Principal: `Destino`**
  * Representa los lugares o ciudades turísticas almacenadas en la base de datos de la plataforma.
  * **Atributos:**
    * `id`: Identificador único del destino.
    * `nombre`: Nombre de la ciudad o región.
    * `pais`: País al que pertenece.
    * `continente`: Continente o zona geográfica (Europa, Asia, América, África, Oceanía).
    * `descripcion`: Información turística general del destino.
    * `rango_precio`: Clasificación del coste medio del viaje (Económico, Medio, Alto, Lujo).
    * `mejor_epoca`: Época recomendada para la visita (Primavera, Verano, Otoño, Invierno).

* **Entidad Secundaria: `Actividad`**
  * Representa las experiencias, excursiones o puntos de interés específicos que se pueden realizar dentro de un destino.
  * **Atributos:**
    * `id`: Identificador único de la actividad.
    * `titulo`: Nombre de la experiencia.
    * `descripcion`: Detalle de la actividad o excursión.
    * `precio`: Precio individual en euros (€).
    * `categoria_actividad`: Tipo de experiencia (Aventura, Cultura, Gastronomía, Naturaleza).
    * `requiere_reserva`: Indicador de si se requiere reserva previa.

### Imágenes
* **Entidad Principal (`Destino`):** Cada entidad principal tendrá su imagen asociada.
* **Entidad Secundaria (`Actividad`):** Cada entidad secundaria tiene su propia imagen.

### Buscador, filtrado o categorización
* **Buscador:** Cuadro de texto libre que permite consultar aquellos destinos en los que el término introducido esté incluido en el atributo `nombre`.
* **Filtrado:** Permite filtrar el catálogo de destinos por los siguientes parámetros:
  * **País:** Filtra los destinos pertenecientes a un país concreto.
  * **Rango de precio:** Filtro por clasificación de coste (`Económico`, `Medio`, `Alto`, `Lujo`).
  * **Época recomendada:** Selección según la temporada ideal de viaje (`Primavera`, `Verano`, `Otoño`, `Invierno`).
* **Categorización:** Menú de navegación principal/lateral que organiza y muestra los destinos clasificados por su `continente` o zona geográfica (`Europa`, `Asia`, `América`, `África`, `Oceanía`).
* **Filtrado:** Formulario dinámico para filtrar el catálogo de destinos por su `rango_precio` (o presupuesto máximo) y según el tipo de experiencia disponible.
* **Categorización:** Menú de navegación agrupado por `continente` o zona geográfica para navegar por los diferentes destinos.

# Práctica 1

## Capturas de Pantalla

### Página Principal
[![Página Principal](PhotoFolio/PhotoFolio/assets/img/captura_index.jpg)](PhotoFolio/PhotoFolio/assets/img/captura_index.jpg)

### Página de Detalle
[![Página de Detalle](PhotoFolio/PhotoFolio/assets/img/captura_detalle.jpg)](PhotoFolio/PhotoFolio/assets/img/captura_detalle.jpg)

### Página de Nuevo Elemento
[![Página de Formulario](PhotoFolio/PhotoFolio/assets/img/captura_formulario-jpg.png)](PhotoFolio/PhotoFolio/assets/img/captura_formulario-jpg.png)

---

## Participación de Miembros del Equipo

---

### 👤 Adrián Varea Fernández (`@blodresg`)

#### Descripción de Tareas Realizadas
* Me he encargado de buscar los datos de ejemplo y sus imágenes, de rellenar la página principal colocando sus elementos y sus botones y de algún arreglo o detalle ocasional del resto de la página.
#### 5 Commits Más Significativos
1. [Página principal](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/bdd1b2de160ec25d71985359ff4daf67edbc60a8)
2. [Cambios a index.html](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/3f8333214e6e8ca33b60ca8e048cac7934d1ca87)
3. [Imágenes destinos](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/aa513510ebfdf0eb347e6e4d43e6d414dc33853a)
4. [Json con datos de ejemplo](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/2e66e987fdbb287d4782dc3c80bb186144d77fe9)
5. [Ajustes de archivos y correcciones](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/d47938503b3d96e062e586567d2f44218f0ebd30)

#### 5 Ficheros Principales
1. [`index.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/index.html)
2. [`detail_page.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/detail_page.html)
3. [`new_element.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/new_element.html)
4. [`assets/css/main.css`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/assets/css/main.css)
5. [`data.json`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/data.json)

---

### 👤 Salvador Barquilla Cedillo (`@SalvaB14`)

#### Descripción de Tareas Realizadas
* He diseñado la página de nuevo elemento y el formulario de nueva actividad de la página de detalle. Además de algún que otro arreglo mínimo como buscar la plantilla Bootstrap.

#### 5 Commits Más Significativos
1. [Formuario de nuevo elemento (aún sin detallar por completo)](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/1f1db62c1999a134012ddb9a822d4e3d05d92d04)
2. [Formulario de nueva actividad (aún sin detallar por completo)](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/11a62fd37ed24a3c8bcd37cc4ad1b2e204ed4006)
3. [Elección de algunos elementos mediante desplegables](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/e6e54499bfec819a2be097dda6268096285e4e21)
4. [Cambio final en diseño de formularios](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/6cbae8bcd47d254b9dff0a81f6b6b27c27d0b88c)
5. [Cambio de diseño en los botones](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/158cc52353143c8a6cb360519557b919f2ba2b1e)


#### 5 Ficheros Principales
1. [`new_element.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/new_element.html)
2. [`detail_page.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/detail_page.html)
3. [`index.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/index.html)
4. [`assets/css/main.css`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/assets/css/main.css)
5. [`assets/img`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/assets/img)

---

### 👤 Sergio Abueitah Cantero (`@SergioAbueitah`)

#### Descripción de Tareas Realizadas
* Me he encargado de realizar la pagina de detalle, de buscar las imágenes de la entidad principal y de las entidades secundarias, y de colocar toda la información y los respectivos botones de cada actividad 

#### 5 Commits Más Significativos
1. [Informacion destino](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/5e5080fc9c45c3bf4e61c8148dba36b83a5adf20)
2. [Imágenes y enlaces](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/d8187bbfa87f01cb63c07fb069417a6e9bb665ac)
3. [Completando informacion del destino](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/1aacacce822e41ca8ae53d22d15e44306b3b2e26)
4. [Estilo y color de los botones](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/0449d3ffe7825919583063f5542afcf7e7042fd8)
5. [Cambio final en el color de los botones](https://github.com/CodeURJC-FW-2026-27/webapp03/commit/70e54cc34b77625bf99d94fa4da327899a14c431)

#### 5 Ficheros Principales
1. [`detail_page.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/detail_page.html)
2. [`index.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/index.html)
3. [`new_element.html`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/new_element.html)
4. [`assets/css/main.css`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/assets/css/main.css)
5. [`data.json`](https://github.com/CodeURJC-FW-2026-27/webapp03/blob/main/PhotoFolio/PhotoFolio/data.json)

