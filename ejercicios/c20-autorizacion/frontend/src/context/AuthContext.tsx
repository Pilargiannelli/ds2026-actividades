import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../services/api";
import { borrarToken, guardarToken, obtenerToken } from "../services/sesion";
import type { Credenciales, Rol, Sesion, Usuario } from "../types/auth";

// La sesión como estado global: mismo patrón que en C12 (contexto, proveedor
// y hook propio), con otro dato. El token NO está acá: lo maneja sesion.ts.
interface AuthContextType {
  usuario: Usuario | null; // null = nadie logueado
  cargando: boolean; // true mientras averiguamos quién sos
  estaAutenticado: boolean; // usuario !== null, para leer más cómodo
  tieneRol: (rol: Rol) => boolean;
  login: (credenciales: Credenciales) => Promise<void>;
  logout: () => void;
}

// 1. El contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 2. El proveedor
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  // Si hay token, arrancamos "cargando": todavía no sabemos de quién es.
  const [cargando, setCargando] = useState(obtenerToken() !== null);

  const logout = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  // Rehidratación: F5 borra el estado de React, no el token. Le preguntamos al
  // back quién sos (valida firma y vencimiento). El token no se decodifica acá.
  useEffect(() => {
    if (!obtenerToken()) return; // sin token no hay nada que averiguar
    apiFetch<Usuario>("/auth/yo")
      .then(setUsuario)
      .catch(() => borrarToken()) // vencido o inválido: se limpia
      .finally(() => setCargando(false));
  }, []);

  // Token vencido en medio de la sesión: apiFetch avisa, acá se cierra la sesión.
  useEffect(() => {
    window.addEventListener("sesion-expirada", logout);
    return () => window.removeEventListener("sesion-expirada", logout);
  }, [logout]);

  const login = async (credenciales: Credenciales) => {
    const sesion = await apiFetch<Sesion>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credenciales),
    });
    guardarToken(sesion.token);
    setUsuario(sesion.usuario); // el usuario, no la sesión entera
  };

  const tieneRol = (rol: Rol) => usuario?.rol === rol;

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, estaAutenticado: usuario !== null, tieneRol, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. El hook propio: tira si falta el Provider en vez de devolver null en silencio.
// eslint-disable-next-line react/only-export-components
export function useAuth(): AuthContextType {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
