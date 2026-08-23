import cors from "cors";
import express from "express";
import autorRoutes from "./routes/autor.routes";
import libroRoutes from "./routes/libro.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 📚" });
});

app.use("/api/libros", libroRoutes);
app.use("/api/autores", autorRoutes);

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
