export type Rol = "ADMIN" | "CLIENTE";

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: Rol;
}

// Lo que devuelve POST /api/auth/login (ver el contrato de C19).
export interface Sesion {
  token: string;
  usuario: Usuario;
}
