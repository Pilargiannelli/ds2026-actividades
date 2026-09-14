import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import LibroDetalle from "./pages/LibroDetalle";
import LibroNuevo from "./pages/LibroNuevo";
import Login from "./pages/Login";
import { useFetch } from "./hooks/useFetch";
import type { Libro } from "./types/libro";

function App() {
  const { data, loading, error } = useFetch<Libro[]>("/libros");
  const libros = data ?? [];

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
          <Route path="/login" element={<Login />} />
          <Route path="/libros/nuevo" element={<LibroNuevo />} />
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
