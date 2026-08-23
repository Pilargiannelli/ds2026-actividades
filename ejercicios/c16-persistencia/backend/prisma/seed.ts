import { prisma } from "../src/config/prisma";

const libros = [
  { titulo: "El arca de Noé", autor: "Beatriz Dourmec y Ayax Barnes", genero: "Infantil", img: "/img/arca.jpg", precio: 8500, disponible: true },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Clásico", img: "/img/princ.webp", precio: 6200, disponible: true },
  { titulo: "Los días del venado", autor: "Liliana Bodoc", genero: "Fantasía", img: "/img/venado.jpg", precio: 9800, disponible: true },
  { titulo: "Rayuela", autor: "Julio Cortázar", genero: "Clásico", img: "/img/rayuela.webp", precio: 11500, disponible: true },
  { titulo: "La cocina japonesa", autor: "Hiroko Shimbo", genero: "Gastronomía", img: "/img/hiroko.webp", precio: 15300, disponible: false },
];

const autores = [
  { nombre: "Antoine de Saint-Exupéry", nacionalidad: "Francia" },
  { nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { nombre: "Liliana Bodoc", nacionalidad: "Argentina" },
];

async function main() {
  await prisma.libro.createMany({ data: libros });
  await prisma.autor.createMany({ data: autores });
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
