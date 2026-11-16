# C23 - Deploy de la Libreria (Marea)

Es la Libreria de las actividades anteriores (C21) puesta en produccion con
**Render** (front y back) y **Neon** (PostgreSQL).

| | URL |
|---|---|
| Front | _(completar cuando este deployado)_ |
| Back | _(completar cuando este deployado)_ |

> Los usuarios de prueba no van aca: se pasan por el canal del grupo.

## Correrla local (Docker)

```bash
cp backend/.env.example backend/.env      # y completar los valores
cp frontend/.env.example frontend/.env
docker compose up --build                 # API en http://localhost:3004
docker compose exec api npx prisma migrate dev
docker compose exec api npx prisma db seed

cd frontend
npm install
npm run dev                               # http://localhost:5173
```

Tests: `npm test` dentro de `backend/` y de `frontend/`.

## Deploy

Tres servicios: Neon (base de datos), un Web Service de Render para el back
y un Static Site de Render para el front. Se crean en ese orden porque cada
uno necesita la URL del anterior.

### 1. Neon (base de datos)

Proyecto nuevo en la region **AWS us-east-1** (la misma que Render). De ahi
sale la `DATABASE_URL` **directa** (no la pooled).

### 2. Back: Render > Web Service

- Runtime: Docker
- Root directory: `ejercicios/c23-deploy/backend`
- Dockerfile path: `ejercicios/c23-deploy/backend/Dockerfile.prod`
- Docker build context: `ejercicios/c23-deploy/backend`
- `Dockerfile.prod` es multi-stage: compila con `tsc` y la imagen final solo
  tiene `dist/` y lo que Prisma necesita
- Al arrancar corre `prisma migrate deploy` y despues `node dist/index.js`

| Variable | Valor |
|---|---|
| `DATABASE_URL` | la de Neon, con `?sslmode=require` |
| `JWT_SECRET` | generada por Render (boton *Generate*) |
| `FRONTEND_URL` | la URL del front, sin `/` al final (al principio `http://localhost:5173`) |
| `PORT` | la pone Render sola |

### 3. Front: Render > Static Site

- Root directory: `ejercicios/c23-deploy/frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Variable: `VITE_API_URL` = URL del back + `/api`
- Redirects/Rewrites: `/*` -> `/index.html` (**Rewrite**), para que F5 en
  `/catalogo` no de 404

### 4. CORS

Con la URL del front ya creada, cambiar `FRONTEND_URL` en el back (cambiar
una variable redeploya solo).

### 5. Migraciones y datos

- Las migraciones estan en `backend/prisma/migrations/` y las aplica la
  imagen al arrancar (`prisma migrate deploy`).
- Los datos de demo (libros, autores, categorias y usuarios) se cargan una
  vez desde la compu, apuntando a Neon:

```bash
docker compose run --rm -e DATABASE_URL="<url de Neon>" api npx prisma db seed
```

El seed es idempotente: se puede volver a correr sin duplicar nada.

### Auto-deploy

Cada push a `main` que toque `backend/` o `frontend/` vuelve a buildear y
publicar ese servicio. Si el build o una migracion fallan, sigue andando la
version anterior.

> El back del plan gratuito se duerme sin trafico: el primer pedido puede
> tardar cerca de un minuto.
