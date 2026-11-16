import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../src/config/env";
import { prisma } from "../src/config/prisma";
import { autores, categorias, libros, precioDeReferencia } from "./catalogo/index";

const usuarios = [
  { email: "admin@libreria.test", nombre: "Admin", rol: "ADMIN" as const, password: "Admin1234" },
  { email: "cliente@libreria.test", nombre: "Cliente", rol: "CLIENTE" as const, password: "Cliente1234" },
];

async function main() {
  // 0) usuarios: upsert = idempotente, corré el seed las veces que quieras
  for (const { password, ...datos } of usuarios) {
    // el password se saca del spread: si no, Prisma tira "Unknown argument `password`"
    await prisma.usuario.upsert({
      where: { email: datos.email },
      update: {},
      create: { ...datos, passwordHash: await bcrypt.hash(password, SALT_ROUNDS) },
    });
  }

  // 1) los autores y las categorías primero: un libro necesita un autorId que exista
  // skipDuplicates: los autores que ya existen conservan su nacionalidad
  await prisma.autor.createMany({ data: autores, skipDuplicates: true });
  // Autores que ya existían sin nacionalidad: se completa si ahora está verificada.
  for (const { nombre, nacionalidad } of autores) {
    if (nacionalidad) await prisma.autor.updateMany({ where: { nombre, nacionalidad: null }, data: { nacionalidad } });
  }
  for (const { nombre, orden } of categorias) {
    // upsert: si la categoría ya existía, igual le asigna su orden de estante
    await prisma.categoria.upsert({ where: { nombre }, update: { orden: orden ?? null }, create: { nombre, orden } });
  }

  // 2) los libros (todos vienen de prisma/catalogo/: un archivo por disciplina)
  for (const { autor, cats, ...datos } of libros) {
    const categoriasConnect = cats.map((nombre) => ({ nombre }));
    // título + autor: hay títulos repetidos de autores distintos (p. ej. «Self Portrait»)
    const yaExiste = await prisma.libro.findFirst({ where: { titulo: datos.titulo, autor: { nombre: autor } } });

    if (yaExiste) {
      // Completa los datos bibliográficos y las categorías. No toca precio ni disponibilidad
      // (pueden haber cambiado desde la app). La imagen solo se pone si no tenía o si era
      // una de Open Library (puede haber aparecido la de la 1.ª edición); una cargada desde
      // la app no se pisa.
      const imagenReemplazable = yaExiste.imagen == null || yaExiste.imagen.startsWith("https://covers.openlibrary.org/");
      await prisma.libro.update({
        where: { id: yaExiste.id },
        data: {
          ...(imagenReemplazable && datos.imagen ? { imagen: datos.imagen } : {}),
          anio: datos.anio,
          editorial: datos.editorial,
          descripcion: datos.descripcion,
          generos: datos.generos ?? [],
          categorias: { connect: categoriasConnect }, // connect es idempotente
        },
      });
      continue;
    }

    await prisma.libro.create({
      data: {
        ...datos,
        imagen: datos.imagen ?? null,
        precio: datos.precio ?? precioDeReferencia(datos.titulo),
        autor: { connect: { nombre: autor } }, // por nombre: es @unique
        categorias: { connect: categoriasConnect },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed cargado ✅");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
