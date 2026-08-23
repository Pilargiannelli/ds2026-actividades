CREATE TABLE IF NOT EXISTS libros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  genero VARCHAR(100),
  precio NUMERIC(10, 2) DEFAULT 0,
  disponible BOOLEAN DEFAULT true
);

INSERT INTO libros (titulo, autor, genero, precio, disponible) VALUES
  ('El arca de Noé', 'Beatriz Dourmec y Ayax Barnes', 'Infantil', 8500, true),
  ('El principito', 'Antoine de Saint-Exupéry', 'Clásico', 6200, true),
  ('Los días del venado', 'Liliana Bodoc', 'Fantasía', 9800, true),
  ('Rayuela', 'Julio Cortázar', 'Clásico', 11500, true),
  ('La cocina japonesa', 'Hiroko Shimbo', 'Gastronomía', 15300, false),
  ('El faro del fin del mundo', 'Julio Verne', 'Aventura', 7400, true),
  ('La felicidad conyugal', 'León Tolstoi', 'Clásico', 6900, true),
  ('La tempestad', 'William Shakespeare', 'Teatro', 5300, true),
  ('Nuestra señora de París', 'Víctor Hugo', 'Clásico', 10200, true),
  ('El baile', 'Irene Némirovsky', 'Novela', 6800, false),
  ('El hombre en busca de sentido', 'Viktor Frankl', 'Ensayo', 7900, true),
  ('Biopausia', 'Gisela Gilges', 'Ensayo', 8700, true),
  ('Amanecer en la cosecha', 'Suzanne Collins', 'Juvenil', 12400, true)
ON CONFLICT DO NOTHING;
