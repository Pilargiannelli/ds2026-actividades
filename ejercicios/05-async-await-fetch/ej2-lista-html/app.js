"use strict";
// trae los usuarios de la API
async function obtenerUsuarios() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const datos = await res.json();
    return datos;
}
// muestra los usuarios en pantalla
function renderizar(usuarios) {
    const ul = document.getElementById("lista");
    ul.innerHTML = "";
    for (let i = 0; i < usuarios.length; i++) {
        const li = document.createElement("li");
        li.textContent = usuarios[i].name + " - " + usuarios[i].email;
        ul.appendChild(li);
    }
}
// arranca todo
async function main() {
    const cargando = document.getElementById("cargando");
    const error = document.getElementById("error");
    try {
        cargando.style.display = "block";
        const usuarios = await obtenerUsuarios();
        renderizar(usuarios);
        cargando.style.display = "none";
    }
    catch (e) {
        cargando.style.display = "none";
        error.textContent = "Error al cargar usuarios";
    }
}
main();
