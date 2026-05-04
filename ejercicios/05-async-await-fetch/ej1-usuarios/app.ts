interface Usuario {
    id: number;
    name: string;
    email: string;
    phone: string;
}


async function obtenerUsuarios(): Promise<Usuario[]> {

    try {
        const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");

        const datos: Usuario[] = await respuesta.json();

        return datos;

        } catch (error) {
            console.error("Error al obtener usuarios", error);
            return [];
    }
}


async function main() {

    const usuarios = await obtenerUsuarios();

    for (let i = 0; i < usuarios.length; i++) {
        console.log(usuarios[i].name + " - " + usuarios[i].email);
    }
}

main();