import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  img: string;
  precio: number;
  disponible: boolean;
}

const libros: Libro[] = [
  { id: 1, titulo: "El arca de Noé", autor: "Beatriz Dourmec y Ayax Barnes", genero: "Infantil", img: "/img/arca.jpg", precio: 8500, disponible: true },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Clásico", img: "/img/princ.webp", precio: 6200, disponible: true },
  { id: 3, titulo: "Los días del venado", autor: "Liliana Bodoc", genero: "Fantasía", img: "/img/venado.jpg", precio: 9800, disponible: true },
  { id: 4, titulo: "Rayuela", autor: "Julio Cortázar", genero: "Clásico", img: "/img/rayuela.webp", precio: 11500, disponible: true },
  { id: 5, titulo: "La cocina japonesa", autor: "Hiroko Shimbo", genero: "Gastronomía", img: "/img/hiroko.webp", precio: 15300, disponible: false },
];

interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

const autores: Autor[] = [
  { id: 1, nombre: "Antoine de Saint-Exupéry", nacionalidad: "Francia" },
  { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { id: 3, nombre: "Liliana Bodoc", nacionalidad: "Argentina" },
];

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 📚" });
});

app.get("/libros", (req, res) => {
  const { disponible } = req.query;

  if (disponible === "true") {
    return res.json(libros.filter((libro) => libro.disponible));
  }

  if (disponible === "false") {
    return res.json(libros.filter((libro) => !libro.disponible));
  }

  res.json(libros);
});

app.get("/autores", (_req, res) => {
  res.json(autores);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
