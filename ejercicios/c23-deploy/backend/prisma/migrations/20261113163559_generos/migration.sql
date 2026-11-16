-- AlterTable
ALTER TABLE "Libro" ADD COLUMN     "generos" TEXT[] DEFAULT ARRAY[]::TEXT[];
