function clasificarNota(nota){
    if(nota < 4){
        return "Desaprobado";
    }
    if(nota >= 4 && nota <= 7){
        return "Aprobado";
    }
    if(nota >=8 && nota <= 10){
        return "Promocionado";
    }
    else {
        return "Nota inválida";
    }
}

function diaDeLaSemana(numero) {
    switch (numero) {
        case 1: return "Lunes";
        case 2: return "Martes";
        case 3: return "Miércoles";
        case 4: return "Jueves";
        case 5: return "Viernes";
        case 6: return "Sábado (fin de semana)";
        case 7: return "Domingo (fin de semana)";
        default: return "Día inválido";
    }
}