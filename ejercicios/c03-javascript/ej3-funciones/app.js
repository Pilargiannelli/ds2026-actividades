function calcularPrecioFinal(monto, medioPago){
    let descuento = 0;
    if(monto < 200){
        descuento = 0;
    } else if (monto <= 400){
        if(medioPago === "E"){
            descuento = 0.30;
        } else if (medioPago === "D"){
            descuento = 0.20;
        } else if (medioPago === "C"){
            descuento = 0.10;
        }
    } else {
        descuento = 0.40;
    }

    let final = monto - (monto * descuento);
    return final;
}

console.log(`Monto: 300 | Pago: E | Final: ${calcularPrecioFinal(300,"E")}`);
console.log(`Monto: 400 | Pago: D | Final: ${calcularPrecioFinal(400,"D")}`);
console.log(`Monto: 100 | Pago: C | Final: ${calcularPrecioFinal(100,"C")}`);
console.log(`Monto: 600 | Pago: E | Final: ${calcularPrecioFinal(600,"E")}`);
console.log(`Monto: 150 | Pago: C | Final: ${calcularPrecioFinal(150,"C")}`);