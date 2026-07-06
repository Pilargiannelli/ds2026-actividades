import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import LibroDetalle from "./pages/LibroDetalle";
import LibroNuevo from "./pages/LibroNuevo";
import { librosIniciales } from "./data/libros";
import type { Libro, NuevoLibro } from "./types/libro";

function App() {
  const [libros, setLibros] = useState<Libro[]>(librosIniciales);

  function agregarLibro(nuevo: NuevoLibro) {
    const id = Math.max(0, ...libros.map((libro) => libro.id)) + 1;
    setLibros((prev) => [...prev, { id, genero: "General", ...nuevo }]);
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo libros={libros} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/libros/nuevo" element={<LibroNuevo agregarLibro={agregarLibro} />} />
          <Route path="/libros/:id" element={<LibroDetalle libros={libros} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
