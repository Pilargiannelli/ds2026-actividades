import { obtenerToken } from "./sesion";

const BASE = import.meta.env.VITE_API_URL;

interface ErrorApi {
  error?: string;
}

// Una sola puerta de salida: arma la base URL, manda el token si existe,
// y preserva el mensaje real del error de la API (en vez de tragarlo).
export async function apiFetch<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const token = obtenerToken();

  const res = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  });

  // Un 404 de ruta (o cualquier error que no venga del errorHandler) puede
  // llegar en HTML, no JSON: res.json() explotaría con SyntaxError.
  const cuerpo = (await res.json().catch(() => null)) as ErrorApi | null;

  if (!res.ok) throw new Error(cuerpo?.error ?? `Error ${res.status}`);

  return cuerpo as T;
}
