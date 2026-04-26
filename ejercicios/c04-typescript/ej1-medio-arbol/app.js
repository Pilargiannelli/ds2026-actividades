"use strict";
function generarArbol() {
    // Traigo los elementos del HTML
    const input = document.getElementById("numero");
    const resultado = document.getElementById("resultado");
    // Paso el valor a número
    const num = Number(input.value);
    // Validación básica
    if (num < 1 || isNaN(num)) {
        resultado.textContent = "Número inválido";
        return;
    }
    // Armo el árbol
    let texto = "";
    for (let i = 1; i <= num; i++) {
        texto += "*".repeat(i) + "\n";
    }
    // Muestro el resultado
    resultado.textContent = texto;
}
// Conecto el botón
const boton = document.getElementById("btnGenerar");
boton.addEventListener("click", generarArbol);
