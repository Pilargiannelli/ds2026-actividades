interface LibroOL {
    title: string;
    author_name?: string[];
    first_publish_year?: number;
}


// trae los libros de la API
async function buscarLibros(texto: string): Promise<LibroOL[]> {

    const res = await fetch("https://openlibrary.org/search.json?q=" + texto);

    const data = await res.json();

    return data.docs;
}


// muestra los resultados
function renderizar(libros: LibroOL[]): void {

    const contenedor = document.getElementById("resultados") as HTMLElement;

    contenedor.innerHTML = "";

    for (let i = 0; i < libros.length && i < 10; i++) {

        const libro = libros[i];

        const div = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = libro.title;

        const autor = document.createElement("p");
        autor.textContent = libro.author_name ? libro.author_name[0] : "Autor desconocido";

        const anio = document.createElement("p");
        anio.textContent = libro.first_publish_year
            ? "Año: " + libro.first_publish_year
            : "Año desconocido";

        div.appendChild(titulo);
        div.appendChild(autor);
        div.appendChild(anio);

        contenedor.appendChild(div);
    }
}


// botón
const btn = document.getElementById("btnBuscar") as HTMLButtonElement;

btn.addEventListener("click", async () => {

    const input = document.getElementById("busqueda") as HTMLInputElement;
    const error = document.getElementById("error") as HTMLElement;

    error.textContent = "";

    if (input.value.trim() === "") {
        error.textContent = "Escribí algo";
        return;
    }

    const libros = await buscarLibros(input.value);

    renderizar(libros);
});