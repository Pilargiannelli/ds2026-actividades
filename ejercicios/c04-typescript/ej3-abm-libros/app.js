"use strict";
// Catálogo inicial
const catalogo = [
    { isbn: "1", titulo: "El principito", autor: "Saint-Exupéry", precio: 8900, disponible: true },
    { isbn: "2", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 22999, disponible: false },
    { isbn: "3", titulo: "El psicoanalista", autor: "John Katzenbach", precio: 37500, disponible: true },
    { isbn: "4", titulo: "Hamlet", autor: "William Shakespeare", precio: 20000, disponible: true },
    { isbn: "5", titulo: "La Odisea", autor: "Homero", precio: 24860, disponible: false },
    { isbn: "6", titulo: "Hábitos Atómicos", autor: "James Clear", precio: 16999, disponible: true }
];
// ------------------- FUNCIONES NUEVAS (FILTROS) -------------------
// Buscar por autor
function buscarPorAutor(autor) {
    return catalogo.filter(libro => libro.autor.toLowerCase().includes(autor.toLowerCase()));
}
// Libros disponibles
function librosDisponibles() {
    return catalogo.filter(libro => libro.disponible);
}
// Precio promedio
function precioPromedio(libros) {
    let total = 0;
    for (let i = 0; i < libros.length; i++) {
        total += libros[i].precio;
    }
    return libros.length > 0 ? total / libros.length : 0;
}
// ------------------- ABM -------------------
// Agregar libro
function agregarLibro(libro) {
    catalogo.push(libro);
    renderizar(catalogo);
}
// Eliminar libro
function eliminarLibro(isbn) {
    const index = catalogo.findIndex(libro => libro.isbn === isbn);
    if (index !== -1) {
        catalogo.splice(index, 1);
        renderizar(catalogo);
    }
}
// Validar formulario
function validarFormulario() {
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const precio = Number(document.getElementById("precio").value);
    const disponible = document.getElementById("disponible").checked;
    const error = document.getElementById("errorForm");
    error.textContent = "";
    if (!titulo || !autor || precio <= 0) {
        error.textContent = "Datos inválidos";
        return null;
    }
    return {
        isbn: "AUTO-" + Date.now(),
        titulo,
        autor,
        precio,
        disponible
    };
}
function renderizar(libros) {
    const ul = document.getElementById("listado");
    const stats = document.getElementById("stats");
    ul.innerHTML = "";
    for (let i = 0; i < libros.length; i++) {
        const li = document.createElement("li");
        li.textContent =
            libros[i].titulo + " - " +
                libros[i].autor + " ($" + libros[i].precio + ") ";
        // botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => eliminarLibro(libros[i].isbn);
        li.appendChild(btnEliminar);
        ul.appendChild(li);
    }
    stats.textContent =
        "Cantidad: " + libros.length +
            " | Promedio: $" + precioPromedio(libros);
}
// Botón agregar
const btnAgregar = document.getElementById("agregar");
btnAgregar.addEventListener("click", () => {
    const libro = validarFormulario();
    if (libro === null)
        return;
    agregarLibro(libro);
    // limpiar form
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("precio").value = "";
});
// Botón filtrar
const btnFiltrar = document.getElementById("filtrar");
btnFiltrar.addEventListener("click", () => {
    const input = document.getElementById("filtroAutor");
    renderizar(buscarPorAutor(input.value));
});
// Botón disponibles
const btnDisponibles = document.getElementById("mostrarDisponibles");
btnDisponibles.addEventListener("click", () => {
    renderizar(librosDisponibles());
});
// Botón ver todos
const btnTodos = document.getElementById("mostrarTodos");
btnTodos.addEventListener("click", () => {
    renderizar(catalogo);
});
renderizar(catalogo);
