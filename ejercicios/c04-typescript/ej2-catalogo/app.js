"use strict";
//ARRAY (catálogo de libros)
const catalogo = [
    { isbn: "1", titulo: "El principito", autor: "Saint-Exupéry", precio: 8900, disponible: true },
    { isbn: "2", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 22999, disponible: false },
    { isbn: "3", titulo: "El psicoanalista", autor: "John Katzenbach", precio: 37500, disponible: true },
    { isbn: "4", titulo: "Hamlet", autor: "William Shakespeare", precio: 20000, disponible: true },
    { isbn: "5", titulo: "La Odisea", autor: "Homero", precio: 24860, disponible: false },
    { isbn: "6", titulo: "Hábitos Atómicos", autor: "James Clear", precio: 16999, disponible: true }
];
//BUSCAR POR AUTOR
function buscarPorAutor(autor) {
    return catalogo.filter(libro => libro.autor.toLowerCase().includes(autor.toLowerCase()));
}
//LIBROS DISPONIBLES
function librosDisponibles() {
    return catalogo.filter(libro => libro.disponible);
}
//PRECIO PROMEDIO
function precioPromedio(libros) {
    let total = 0;
    for (let i = 0; i < libros.length; i++) {
        total += libros[i].precio;
    }
    return libros.length > 0 ? total / libros.length : 0;
}
//RENDERIZAR (mostrar en pantalla)
function renderizar(libros) {
    const ul = document.getElementById("listado");
    const stats = document.getElementById("stats");
    // limpio lista
    ul.innerHTML = "";
    // recorro libros
    for (let i = 0; i < libros.length; i++) {
        const li = document.createElement("li");
        li.textContent = libros[i].titulo + " - " + libros[i].autor + " ($" + libros[i].precio + ")";
        ul.appendChild(li);
    }
    // stats
    stats.textContent =
        "Cantidad: " + libros.length +
            " | Promedio: $" + precioPromedio(libros);
}
//BOTONES
// Filtrar
const btnFiltrar = document.getElementById("filtrar");
btnFiltrar.addEventListener("click", () => {
    const input = document.getElementById("filtroAutor");
    renderizar(buscarPorAutor(input.value));
});
// Solo disponibles
const btnDisponibles = document.getElementById("mostrarDisponibles");
btnDisponibles.addEventListener("click", () => {
    renderizar(librosDisponibles());
});
// Ver todos
const btnTodos = document.getElementById("mostrarTodos");
btnTodos.addEventListener("click", () => {
    renderizar(catalogo);
});
renderizar(catalogo);
