import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../src/config/env";
import { prisma } from "../src/config/prisma";

const usuarios = [
  { email: "admin@libreria.test", nombre: "Admin", rol: "ADMIN" as const, password: "Admin1234" },
  { email: "cliente@libreria.test", nombre: "Cliente", rol: "CLIENTE" as const, password: "Cliente1234" },
];

const autores = [
  { nombre: "Antoine de Saint-Exupéry", nacionalidad: "Francia" },
  { nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { nombre: "Liliana Bodoc", nacionalidad: "Argentina" },
  { nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
  { nombre: "Hiroko Shimbo", nacionalidad: "Japón" },
];

const categorias = [
  { nombre: "Infantil" },
  { nombre: "Clásico" },
  { nombre: "Fantasía" },
  { nombre: "Cuento" },
  { nombre: "Gastronomía" },
];

const libros = [
  {
    titulo: "El principito",
    autor: "Antoine de Saint-Exupéry",
    precio: 6200,
    imagen: "/img/princ.webp",
    disponible: true,
    cats: ["Infantil", "Clásico"],
  },
  {
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    precio: 11500,
    imagen: "/img/rayuela.webp",
    disponible: true,
    cats: ["Clásico"],
  },
  {
    titulo: "Bestiario",
    autor: "Julio Cortázar",
    precio: 8900,
    imagen: "/img/bestiario.webp",
    disponible: true,
    cats: ["Cuento"],
  },
  {
    titulo: "Los días del venado",
    autor: "Liliana Bodoc",
    precio: 9800,
    imagen: "/img/venado.jpg",
    disponible: true,
    cats: ["Fantasía"],
  },
  {
    titulo: "Ficciones",
    autor: "Jorge Luis Borges",
    precio: 9200,
    imagen: "/img/ficciones.webp",
    disponible: true,
    cats: ["Cuento", "Clásico"],
  },
  {
    titulo: "El Aleph",
    autor: "Jorge Luis Borges",
    precio: 9400,
    imagen: "/img/aleph.webp",
    disponible: false,
    cats: ["Cuento"],
  },
  {
    titulo: "La cocina japonesa",
    autor: "Hiroko Shimbo",
    precio: 15300,
    imagen: "/img/hiroko.webp",
    disponible: false,
    cats: ["Gastronomía"],
  },
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
  // skipDuplicates: idempotente frente a nombre @unique, igual que el upsert de arriba
  await prisma.autor.createMany({ data: autores, skipDuplicates: true });
  await prisma.categoria.createMany({ data: categorias, skipDuplicates: true });

  // 2) después los libros, enganchando la relación con connect (sin id a mano)
  for (const { autor, cats, ...datos } of libros) {
    const yaExiste = await prisma.libro.findFirst({ where: { titulo: datos.titulo } });
    if (yaExiste) continue; // idempotente: sin @unique en título, chequeamos antes de crear

    await prisma.libro.create({
      data: {
        ...datos,
        autor: { connect: { nombre: autor } }, // por nombre: es @unique
        categorias: { connect: cats.map((nombre) => ({ nombre })) },
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
