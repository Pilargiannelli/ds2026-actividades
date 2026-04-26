function generarArbol(): void {

  // Traigo los elementos del HTML
    const input = document.getElementById("numero") as HTMLInputElement;
    const resultado = document.getElementById("resultado") as HTMLElement;

    // Paso el valor a número
    const num: number = Number(input.value);

    // Validación básica
    if (num < 1 || isNaN(num)) {
        resultado.textContent = "Número inválido";
        return;
    }

    // Armo el árbol
    let texto: string = "";

    for (let i = 1; i <= num; i++) {
        texto += "*".repeat(i) + "\n";
    }

    // Muestro el resultado
    resultado.textContent = texto;
}   

// Conecto el botón
const boton = document.getElementById("btnGenerar") as HTMLButtonElement;
boton.addEventListener("click", generarArbol);