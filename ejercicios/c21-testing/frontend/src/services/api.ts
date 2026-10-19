import { obtenerToken } from "./sesion";

const BASE = import.meta.env.VITE_API_URL;

interface ErrorApi {
  error?: string;
}

// Error con el status HTTP: las páginas pueden distinguir un 403 de un 500.
export class ApiError extends Error {
  status: number;

  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
  }
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

  // 401 habiendo mandado token = sesión vencida o inválida. apiFetch no es un
  // componente (no puede usar useAuth): avisa con un evento y el AuthProvider
  // escucha. Un 401 sin token (login fallido) no es una sesión vencida.
  if (res.status === 401 && token) window.dispatchEvent(new Event("sesion-expirada"));

  if (!res.ok) throw new ApiError(res.status, cuerpo?.error ?? `Error ${res.status}`);

  return cuerpo as T;
}
