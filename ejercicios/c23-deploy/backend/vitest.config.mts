import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

// Los tests corren en el host, no en Docker: nadie carga el .env (Compose lo
// hace con env_file). loadEnv lo lee y expande ${POSTGRES_USER} como Compose.
const env = loadEnv("test", process.cwd(), "");

// En el .env la DB es "db:5432" (la red de Docker). Desde el host, la misma
// base está publicada en localhost:5436 (ver docker-compose.yml).
const databaseUrl = (env.DATABASE_URL ?? "").replace("@db:5432", "@localhost:5436");

export default defineConfig({
  test: {
    env: {
      JWT_SECRET: "secreto-solo-para-tests", // nunca el real: los tokens se firman en el test
      DATABASE_URL: databaseUrl,
    },
  },
});
