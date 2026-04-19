function agregarProducto() {
    let input = document.getElementById("producto");
    let lista = document.getElementById("lista");
    let contador = document.getElementById("contador");

    if (input.value === "") return;

    let li = document.createElement("li");
    li.textContent = input.value;

    let btn = document.createElement("button");
    btn.textContent = "Eliminar";

    btn.onclick = function() {
        lista.removeChild(li);
        actualizarContador();
    };

    li.appendChild(btn);
    lista.appendChild(li);

    input.value = "";
    actualizarContador();
}

function actualizarContador() {
    let lista = document.getElementById("lista");
    let contador = document.getElementById("contador");

    contador.textContent = `${lista.children.length} productos en la lista`;
}