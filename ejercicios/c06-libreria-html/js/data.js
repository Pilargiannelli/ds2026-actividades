/* 
Cúspide Librería — js/data.js
Descripción: lógica del buscador de libros con Open Library API
*/


// ─── Constantes ───────────────────────────────────────────
const API_BASE    = 'https://openlibrary.org/search.json';
const COVER_BASE  = 'https://covers.openlibrary.org/b/id';
const LIMIT       = 12;   // máximo de resultados por búsqueda
const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=Sin+portada';


// ─── Referencias al DOM ───────────────────────────────────
const inputBusqueda  = document.getElementById('inputBusqueda');
const btnBuscar      = document.getElementById('btnBuscar');
const divResultados  = document.getElementById('resultados');
const divEstado      = document.getElementById('estadoBusqueda');


// ─── Función principal: buscar libros en Open Library ─────
async function buscarLibros() {

    const termino = inputBusqueda.value.trim();

    // Validación: no buscar si está vacío
    if (!termino) {
        mostrarMensaje('Por favor ingresá un término de búsqueda.', 'warning');
        return;
    }

    // Mostrar estado de carga
    mostrarCargando();

    try {
        // Fetch a la API
        const url      = `${API_BASE}?q=${encodeURIComponent(termino)}&limit=${LIMIT}`;
        const response = await fetch(url);

        // Verificar que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }

        const data = await response.json();

        // Verificar si hay resultados
        if (!data.docs || data.docs.length === 0) {
            mostrarMensaje(`No encontramos libros para "${termino}". Probá con otro término.`, 'info');
            return;
        }

        // Renderizar los resultados
        renderizarCards(data.docs, termino, data.numFound);

    } catch (error) {
        console.error('Error al buscar libros:', error);
        mostrarMensaje('Hubo un error al conectar con el servidor. Intentá de nuevo.', 'danger');
    }
}


// ─── Renderiza el array de libros como cards Bootstrap ────
function renderizarCards(libros, termino, total) {

    // Limpiar resultados anteriores
    divResultados.innerHTML = '';
    divEstado.innerHTML     = '';

    // Encabezado con cantidad de resultados
    const header = document.createElement('div');
    header.className = 'catalogo__results-header mb-4';
    header.innerHTML = `
        <p class="catalogo__results-count">
            Se encontraron <strong>${total.toLocaleString()}</strong> resultados para 
            "<em>${termino}</em>". Mostrando los primeros ${libros.length}.
        </p>
    `;
    divResultados.appendChild(header);

    // Contenedor de la grilla
    const row = document.createElement('div');
    row.className = 'row g-4';

    libros.forEach(libro => {

        // Construir URL de portada
        const portadaUrl = libro.cover_i
            ? `${COVER_BASE}/${libro.cover_i}-L.jpg`
            : PLACEHOLDER;

        // Autor: puede ser array o undefined
        const autor = libro.author_name
            ? libro.author_name[0]
            : 'Autor desconocido';

        // Año de publicación
        const anio = libro.first_publish_year
            ? libro.first_publish_year
            : '';

        // Crear columna
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';

        // Crear card
        col.innerHTML = `
            <article class="card h-100 shadow-sm border-0 book-card">
                <img
                    src="${portadaUrl}"
                    class="card-img-top book-card__cover"
                    alt="Portada de ${libro.title}"
                    onerror="this.src='${PLACEHOLDER}'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${libro.title}</h5>
                    <p class="card-text text-muted mb-1">
                        <i class="bi bi-person me-1"></i>${autor}
                    </p>
                    ${anio ? `<p class="card-text text-muted small mb-3">
                        <i class="bi bi-calendar me-1"></i>${anio}
                    </p>` : '<div class="mb-3"></div>'}
                    <a href="libro.html" class="btn btn-outline-dark mt-auto">
                        Ver más
                    </a>
                </div>
            </article>
        `;

        row.appendChild(col);
    });

    divResultados.appendChild(row);
}


// ─── Estado: spinner de carga ─────────────────────────────
function mostrarCargando() {
    divResultados.innerHTML = '';
    divEstado.innerHTML = `
        <div class="catalogo__loading text-center py-5">
            <div class="spinner-border text-brand mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted">Buscando libros...</p>
        </div>
    `;
}


// ─── Estado: mensaje de error / vacío / advertencia ───────
function mostrarMensaje(texto, tipo) {
    divResultados.innerHTML = '';
    divEstado.innerHTML = `
        <div class="alert alert-${tipo} d-flex align-items-center gap-2 mt-3" role="alert">
            <i class="bi bi-${tipo === 'danger' ? 'exclamation-triangle' : tipo === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${texto}</span>
        </div>
    `;
}


// ─── Event Listeners ──────────────────────────────────────

// Clic en el botón buscar
btnBuscar.addEventListener('click', buscarLibros);

// Enter en el input también dispara la búsqueda
inputBusqueda.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') buscarLibros();
});