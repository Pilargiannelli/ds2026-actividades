// Interface
interface Libro {
    isbn: string;
    titulo: string;
    autor: string;
    precio: number;
    disponible: boolean;
    genero?: string;
}

// Catálogo inicial
const catalogo: Libro[] = [
    { isbn: "1", titulo: "El principito", autor: "Saint-Exupéry", precio: 8900, disponible: true },
    { isbn: "2", titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 22999, disponible: false },
    { isbn: "3", titulo: "El psicoanalista", autor: "John Katzenbach", precio: 37500, disponible: true },
    { isbn: "4", titulo: "Hamlet", autor: "William Shakespeare", precio: 20000, disponible: true },
    { isbn: "5", titulo: "La Odisea", autor: "Homero", precio: 24860, disponible: false },
    { isbn: "6", titulo: "Hábitos Atómicos", autor: "James Clear", precio: 16999, disponible: true }
];


// ------------------- FUNCIONES NUEVAS (FILTROS) -------------------

// Buscar por autor
function buscarPorAutor(autor: string): Libro[] {
    return catalogo.filter(libro =>
        libro.autor.toLowerCase().includes(autor.toLowerCase())
    );
}

// Libros disponibles
function librosDisponibles(): Libro[] {
    return catalogo.filter(libro => libro.disponible);
}

// Precio promedio
function precioPromedio(libros: Libro[]): number {
    let total = 0;

    for (let i = 0; i < libros.length; i++) {
        total += libros[i].precio;
    }

    return libros.length > 0 ? total / libros.length : 0;
}


// ------------------- ABM -------------------

// Agregar libro
function agregarLibro(libro: Libro): void {
    catalogo.push(libro);
    renderizar(catalogo);
}

// Eliminar libro
function eliminarLibro(isbn: string): void {

    const index = catalogo.findIndex(libro => libro.isbn === isbn);

    if (index !== -1) {
        catalogo.splice(index, 1);
        renderizar(catalogo);
    }
}

// Validar formulario
function validarFormulario(): Libro | null {

    const titulo = (document.getElementById("titulo") as HTMLInputElement).value;
    const autor = (document.getElementById("autor") as HTMLInputElement).value;
    const precio = Number((document.getElementById("precio") as HTMLInputElement).value);
    const disponible = (document.getElementById("disponible") as HTMLInputElement).checked;

    const error = document.getElementById("errorForm") as HTMLElement;
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


function renderizar(libros: Libro[]): void {

    const ul = document.getElementById("listado") as HTMLUListElement;
    const stats = document.getElementById("stats") as HTMLElement;

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
const btnAgregar = document.getElementById("agregar") as HTMLButtonElement;

btnAgregar.addEventListener("click", () => {

    const libro = validarFormulario();

    if (libro === null) return;

    agregarLibro(libro);

    // limpiar form
    (document.getElementById("titulo") as HTMLInputElement).value = "";
    (document.getElementById("autor") as HTMLInputElement).value = "";
    (document.getElementById("precio") as HTMLInputElement).value = "";
});


// Botón filtrar
const btnFiltrar = document.getElementById("filtrar") as HTMLButtonElement;

btnFiltrar.addEventListener("click", () => {
    const input = document.getElementById("filtroAutor") as HTMLInputElement;
    renderizar(buscarPorAutor(input.value));
});


// Botón disponibles
const btnDisponibles = document.getElementById("mostrarDisponibles") as HTMLButtonElement;

btnDisponibles.addEventListener("click", () => {
    renderizar(librosDisponibles());
});


// Botón ver todos
const btnTodos = document.getElementById("mostrarTodos") as HTMLButtonElement;

btnTodos.addEventListener("click", () => {
    renderizar(catalogo);
});


renderizar(catalogo);