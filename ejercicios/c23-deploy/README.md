# C23 - Deploy de la Libreria (Marea)

Es la Libreria de las actividades anteriores (C21) puesta en produccion con
**Render** (front y back) y **Neon** (PostgreSQL).

| | URL |
|---|---|
| Front | https://marea-hhop.onrender.com |
| Back | https://marea-api-hmva.onrender.com/api |

> El back esta en el plan gratuito y se duerme sin trafico: el primer pedido
> puede tardar cerca de un minuto. Los usuarios de prueba no van aca, se
> pasan por el canal del grupo.

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

```
Navegador -> Static Site (front) -> Web Service (back) -> Neon (Postgres)
              VITE_API_URL           FRONTEND_URL (CORS)
                                     DATABASE_URL
```

### 1. Neon (base de datos)

- Opcion "I just need a database connection string".
- Region **AWS us-east-1**, la misma que Render (se ve en el host de la
  cadena: `...us-east-1.aws.neon.tech`).
- En **Connect**: branch `production`, base `neondb`, **Connection pooling
  apagado** (el host no tiene que decir `-pooler`).
- A la cadena le saque `&channel_binding=require` del final: alcanza con
  `?sslmode=require`.

### 2. Back: Render > Web Service

| Campo | Valor |
|---|---|
| Language | Docker |
| Branch | `main` |
| Region | Virginia (US East) |
| Root Directory | `ejercicios/c23-deploy/backend` |
| Dockerfile Path (en **Advanced**) | `./Dockerfile.prod` |
| Instance Type | **Free** (por defecto viene marcado el de $7) |

`Dockerfile.prod` es multi-stage: la primera etapa compila con `tsc` y la
segunda se queda solo con `dist/` y lo que Prisma necesita. Al arrancar corre
`prisma migrate deploy` y despues `node dist/index.js`.

Variables (en **Environment** del servicio, no en un environment group):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | la cadena directa de Neon, con `?sslmode=require` |
| `JWT_SECRET` | generada por Render (boton *Generate*) |
| `FRONTEND_URL` | la URL del front, sin `/` al final (al principio `http://localhost:5173`) |
| `PORT` | la pone Render sola |

Para probarlo: `https://<back>/api/libros` tiene que devolver `[]` antes
del seed.

### 3. Front: Render > Static Site

| Campo | Valor |
|---|---|
| Root Directory | `ejercicios/c23-deploy/frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Variable | `VITE_API_URL` = URL del back + `/api` |
| Redirects/Rewrites | `/*` -> `/index.html`, accion **Rewrite** |

El rewrite es para que F5 en `/catalogo` (o cualquier ruta de React Router)
no de 404. `VITE_API_URL` queda pegada en el JS al hacer el build, por eso si
se cambia hay que volver a deployar el front.

### 4. CORS

Con la URL del front ya creada, cambiar `FRONTEND_URL` en el back. Tiene que
ser exactamente la URL del front: con `https`, sin `/` final, sin comillas ni
espacios. Cambiar una variable redeploya solo.

### 5. Migraciones y datos

- Las migraciones estan en `backend/prisma/migrations/` y las aplica la
  imagen al arrancar (`prisma migrate deploy`): en produccion no se crean,
  solo se aplican las que estan commiteadas.
- Los datos de demo (libros, autores, categorias y usuarios) se cargan una
  vez desde la compu, apuntando a Neon. Desde `backend/` en PowerShell:

```powershell
$env:DATABASE_URL = "<cadena de Neon>"   # entre comillas
$env:JWT_SECRET = "cualquiera"           # el seed la pide para arrancar
npx prisma db seed
```

  O con Docker, desde `c23-deploy/`:

```bash
docker compose run --rm --no-deps -e DATABASE_URL="<cadena de Neon>" api npx prisma db seed
```

El seed es idempotente: se puede volver a correr sin duplicar nada. Tarda
unos minutos porque carga los 983 libros contra una base en Estados Unidos.
El aviso `SECURITY WARNING: The SSL modes...` que aparece es informativo, no
es un error.

### Auto-deploy

Cada push a `main` que toque `backend/` o `frontend/` vuelve a buildear y
publicar ese servicio. Si el build o una migracion fallan, sigue andando la
version anterior.

## Problemas que tuve

| Sintoma | Causa | Arreglo |
|---|---|---|
| El repo no aparecia en Render | la app de Render en GitHub no tenia acceso a ese repo | GitHub > Settings > Applications > Render > Configure, y agregar el repo |
| No encontraba "Dockerfile Path" | esta escondido en **Advanced**, al final del formulario | completarlo ahi con `./Dockerfile.prod` |
| Log: `The datasource.url property is required` | las variables del formulario de creacion no se guardaron | cargarlas de nuevo en **Environment** y redeployar |
| El front no podia llamar a la API (CORS) | `FRONTEND_URL` no coincidia exacto con la URL del front | escribirla a mano, sin `/` final ni espacios |
| PowerShell: `no se reconoce como nombre de un cmdlet` | la cadena iba sin comillas | `$env:DATABASE_URL = "..."` |
