-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "orden" INTEGER;

-- AlterTable
ALTER TABLE "Libro" ADD COLUMN     "anio" INTEGER,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "editorial" TEXT,
ALTER COLUMN "imagen" DROP NOT NULL;
