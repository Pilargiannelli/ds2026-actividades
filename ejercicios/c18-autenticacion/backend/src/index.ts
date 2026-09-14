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

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 📚" });
});

app.use("/api/auth", authRoutes);
app.use("/api/libros", libroRoutes);
app.use("/api/autores", autorRoutes);

// VA ÚLTIMO, después de todas las rutas: si va antes, no se ejecuta nunca.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
