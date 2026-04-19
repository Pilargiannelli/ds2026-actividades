function generarArbol() {
    let numero = document.getElementById("numero").value;
    let resultado = document.getElementById("resultado");

    if (numero < 1) {
        resultado.textContent = "Número inválido";
        return;
    }

    let texto = "";

    for (let i = 1; i <= numero; i++) {
        texto += "*".repeat(i) + "\n";
    }

    resultado.textContent = texto;
}