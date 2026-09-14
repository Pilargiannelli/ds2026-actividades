# C17 — Relaciones y Validaciones (Librería)

API de la librería de C16 con relaciones reales, validación con Zod y manejo
centralizado de errores.

## Qué cambió respecto de C16

| Tema | C16 | C17 |
| --- | --- | --- |
| Autor | `autor String` en cada libro | `Autor` 1:N `Libro` (`autorId` + `@relation`, `onDelete: Restrict`) |
| Categorías | `genero String` | `Libro` N:M `Categoria` (implícita, `_CategoriaToLibro`) |
| Listado / detalle | sólo el libro | `include` del autor (listado) y autor + categorías (detalle), tipado con `Prisma.LibroGetPayload` |
| Validación | ninguna | `src/validations/` con Zod: create, update (`.partial()`) y params (`z.coerce.number()`) |
| Middlewares | ninguno | `validate`, `validateParams` y `errorHandler` (mapea `P2002`→409, `P2025`→404, `P2003`→409) |
| Errores | 10 `try/catch`, todo 500 | cero `try/catch` en los controllers (Express 5 reenvía las promesas rechazadas al `errorHandler`) |

## Correr

```bash
docker compose up -d --build
docker compose exec api npx prisma migrate dev --name relaciones   # ya commiteada
docker compose exec api npx prisma generate                        # comando aparte
docker compose exec api npx prisma db seed                         # reset NO corre el seed
```

- API: <http://localhost:3001>  ·  Postgres: `localhost:5433`  ·  Prisma Studio: `5556`
  (puertos corridos para no chocar con otros proyectos; adentro del contenedor la API sigue en 3000).
- `backend/api.http` tiene el camino feliz y los casos de error 400 / 404 / 409.

## Estructura del backend

```
src/
  validations/   libro / autor (create + update) + params (idParamSchema)
  middlewares/   validate.middleware.ts · error.middleware.ts
  services/      include + tipos con GetPayload
  controllers/   sin try/catch
  types/         re-export del schema + tipos *ConAutor / *Detalle / *ConLibros
```
