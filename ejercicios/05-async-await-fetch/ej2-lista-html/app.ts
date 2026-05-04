interface Usuario {
    id: number;
    name: string;
    email: string;
    phone: string;
}


// trae los usuarios de la API
async function obtenerUsuarios(): Promise<Usuario[]> {

    const res = await fetch("https://jsonplaceholder.typicode.com/users");

    const datos: Usuario[] = await res.json();

    return datos;
}


// muestra los usuarios en pantalla
function renderizar(usuarios: Usuario[]): void {

    const ul = document.getElementById("lista") as HTMLUListElement;

    ul.innerHTML = "";

    for (let i = 0; i < usuarios.length; i++) {

        const li = document.createElement("li");

        li.textContent = usuarios[i].name + " - " + usuarios[i].email;

        ul.appendChild(li);
    }
}


// arranca todo
async function main() {

    const cargando = document.getElementById("cargando") as HTMLElement;
    const error = document.getElementById("error") as HTMLElement;

    try {

        cargando.style.display = "block";

        const usuarios = await obtenerUsuarios();

        renderizar(usuarios);

        cargando.style.display = "none";

    } catch (e) {

        cargando.style.display = "none";
        error.textContent = "Error al cargar usuarios";
    }
}


main();