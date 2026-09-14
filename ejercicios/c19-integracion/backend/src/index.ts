import cors from "cors";
import express from "express";
import { z } from "zod";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import autorRoutes from "./routes/autor.routes";
import libroRoutes from "./routes/libro.routes";

// Mensajes por defecto de Zod en español.
z.config(z.locales.es());

const app = express();
const PORT = process.env.PORT || 3000;

// origin como lista, nunca "*": sin credentials no hace falta y "*" deja
// que cualquier página lea la API. 1º, ANTES de json() y de las rutas.
const corsOptions = { origin: [process.env.FRONTEND_URL ?? "http://localhost:5173"] };
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 📚" });
});

app.use("/api/auth", authRoutes);
app.use("/api/libros", libroRoutes);
app.use("/api/autores", autorRoutes);

// 404 en JSON: sin esto, una ruta que no existe cae en el 404 default de
// Express (HTML), y res.json() del lado del front explota con SyntaxError.
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// VA ÚLTIMO, después de todas las rutas: si va antes, no se ejecuta nunca.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
