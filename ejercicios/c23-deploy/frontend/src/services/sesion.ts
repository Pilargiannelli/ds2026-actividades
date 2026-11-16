// El token vive en localStorage (decisión de la materia, con el riesgo de XSS
// declarado). Solo lo tocan api.ts y el AuthContext: ningún componente.
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
