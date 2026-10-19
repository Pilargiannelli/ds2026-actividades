import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import type { Rol } from "../types/auth";

// Layout route: se usa como <Route element={<PrivateRoute rol="ADMIN" />}> y
// las rutas hijas se renderizan en el <Outlet />. Esconder es UX, no seguridad:
// la regla de verdad sigue en el back (401 / 403).
export default function PrivateRoute({ rol }: { rol?: Rol }) {
  const { usuario, cargando } = useAuth();

  // 1. ¿ya sé quién sos? Sin esto, F5 te tira a /login con datos viejos.
  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  // 2. ¿sos alguien? (el 401 del back). replace: la redirección no queda en el historial.
  if (!usuario) return <Navigate to="/login" replace />;

  // 3. ¿podés? (el 403 del back)
  if (rol && usuario.rol !== rol) return <Navigate to="/sin-permiso" replace />;

  return <Outlet />;
}
