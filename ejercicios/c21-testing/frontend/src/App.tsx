import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { TiendaProvider } from "./context/TiendaContext";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Favoritos from "./pages/Favoritos";
import LibroDetalle from "./pages/LibroDetalle";
import LibroNuevo from "./pages/LibroNuevo";
import Login from "./pages/Login";
import MiCuenta from "./pages/MiCuenta";
import SinPermiso from "./pages/SinPermiso";
import { useFetch } from "./hooks/useFetch";
import type { Libro } from "./types/libro";

function App() {
  const { data, loading, error } = useFetch<Libro[]>("/libros");
  const libros = data ?? [];

  return (
    <BrowserRouter>
      {/* Arriba de Layout: el Header consume useAuth() y useTienda() */}
      <AuthProvider>
        <TiendaProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home libros={libros} />} />
              <Route
                path="/catalogo"
                element={<Catalogo libros={libros} loading={loading} error={error} />}
              />
              <Route path="/carrito" element={<Carrito libros={libros} loading={loading} />} />
              <Route path="/favoritos" element={<Favoritos libros={libros} loading={loading} />} />
              <Route path="/contacto" element={<Contacto libros={libros} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sin-permiso" element={<SinPermiso />} />

              {/* sin path ni rol: cualquier usuario logueado */}
              <Route element={<PrivateRoute />}>
                <Route path="/mi-cuenta" element={<MiCuenta />} />
              </Route>

              {/* sin path: layout route. Solo ADMIN */}
              <Route element={<PrivateRoute rol="ADMIN" />}>
                <Route path="/libros/nuevo" element={<LibroNuevo />} />
              </Route>

              <Route
                path="/libros/:id"
                element={<LibroDetalle libros={libros} loading={loading} error={error} />}
              />
            </Routes>
          </Layout>
        </TiendaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
