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
1. [Página principal](https://github.com/blodresg/CodeURJC-FW-2025-27/webapp03/commit/bdd1b2de160ec25d71985359ff4daf67edbc60a8)
2. [feat: implement detailed view for destination items](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_2)
3. [fix: validate JSON structure for mock travel data](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_3)
4. [refactor: update Bootstrap navbar and footer components](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_4)
5. [docs: structure initial README setup](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_5)

#### 5 Ficheros Principales
1. [`public/index.html`](https://github.com/USUARIO/REPO/blob/main/public/index.html)
2. [`public/js/main.js`](https://github.com/USUARIO/REPO/blob/main/public/js/main.js)
3. [`src/data/destinations.json`](https://github.com/USUARIO/REPO/blob/main/src/data/destinations.json)
4. [`public/css/styles.css`](https://github.com/USUARIO/REPO/blob/main/public/css/styles.css)
5. [`views/destination-detail.html`](https://github.com/USUARIO/REPO/blob/main/views/destination-detail.html)

---

### 👤 Salvador Barquilla Cedillo (`@SalvaB14`)

#### Descripción de Tareas Realizadas
* Configuración inicial del repositorio, ramas de trabajo y estructura de carpetas del proyecto.
* Desarrollo e integración del sistema de filtros por continente, país y rango de precios.
* Implementación de la lógica de procesamiento para formularios de la aplicación.

#### 5 Commits Más Significativos
1. [chore: initial repository configuration and project setup](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_1)
2. [feat: implement destination filter logic](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_2)
3. [feat: add form validation for new items](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_3)
4. [fix: resolve filter persistence issues on page load](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_4)
5. [refactor: optimize data querying functions](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_5)

#### 5 Ficheros Principales
1. [`src/routes/filters.js`](https://github.com/USUARIO/REPO/blob/main/src/routes/filters.js)
2. [`public/js/filters.js`](https://github.com/USUARIO/REPO/blob/main/public/js/filters.js)
3. [`views/new-item.html`](https://github.com/USUARIO/REPO/blob/main/views/new-item.html)
4. [`src/controllers/itemController.js`](https://github.com/USUARIO/REPO/blob/main/src/controllers/itemController.js)
5. [`public/css/filters.css`](https://github.com/USUARIO/REPO/blob/main/public/css/filters.css)

---

### 👤 Sergio Abueitah Cantero (`@SergioAbueitah`)

#### Descripción de Tareas Realizadas
* Diseño y maquetación responsiva del menú de navegación y pie de página.
* Estilado de componentes para la visualización de detalles de actividades en cada destino.
* Ajustes de accesibilidad y adaptación del diseño general a diferentes resoluciones de pantalla.

#### 5 Commits Más Significativos
1. [style: add header and responsive navigation bar](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_1)
2. [feat: design activity detail view layout](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_2)
3. [style: apply consistent footer layout across pages](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_3)
4. [fix: media query adjustments for mobile screens](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_4)
5. [style: integrate activity card component styles](https://github.com/USUARIO/REPO/commit/HASH_COMMIT_5)

#### 5 Ficheros Principales
1. [`public/css/navbar.css`](https://github.com/USUARIO/REPO/blob/main/public/css/navbar.css)
2. [`views/activity-detail.html`](https://github.com/USUARIO/REPO/blob/main/views/activity-detail.html)
3. [`public/css/footer.css`](https://github.com/USUARIO/REPO/blob/main/public/css/footer.css)
4. [`src/data/activities.json`](https://github.com/USUARIO/REPO/blob/main/src/data/activities.json)
5. [`public/js/activities.js`](https://github.com/USUARIO/REPO/blob/main/public/js/activities.js)
