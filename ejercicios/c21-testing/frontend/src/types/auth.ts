export type Rol = "ADMIN" | "CLIENTE";

// Lo que devuelve el back en el login y en GET /api/auth/yo.
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

// Lo que manda el form de login.
export interface Credenciales {
  email: string;
  password: string;
}
