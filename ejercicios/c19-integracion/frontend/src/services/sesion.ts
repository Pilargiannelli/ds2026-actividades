// El token vive en localStorage por ahora. Sin AuthContext todavía: eso es
// tema de la próxima clase (sesión como estado global de React).
const TOKEN_KEY = "libreria_token";

export function guardarToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function borrarToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
