export {};

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; rol: "ADMIN" | "CLIENTE" }; // opcional: en una ruta pública nadie lo llenó
    }
  }
}
