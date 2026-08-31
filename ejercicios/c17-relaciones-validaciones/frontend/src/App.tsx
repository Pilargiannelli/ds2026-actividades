import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import LibroDetalle from "./pages/LibroDetalle";
import LibroNuevo from "./pages/LibroNuevo";
import { useFetch } from "./hooks/useFetch";
import type { Libro, NuevoLibro } from "./types/libro";

function App() {
  const { data, loading, error } = useFetch<Libro[]>("/libros.json");
  const [libros, setLibros] = useState<Libro[]>([]);

  useEffect(() => {
    if (data) setLibros(data);
  }, [data]);

  function agregarLibro(nuevo: NuevoLibro) {
    const id = Math.max(0, ...libros.map((libro) => libro.id)) + 1;
    setLibros((prev) => [...prev, { id, genero: "General", ...nuevo }]);
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/catalogo"
            element={<Catalogo libros={libros} loading={loading} error={error} />}
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/libros/nuevo" element={<LibroNuevo agregarLibro={agregarLibro} />} />
          <Route
            path="/libros/:id"
            element={<LibroDetalle libros={libros} loading={loading} error={error} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
