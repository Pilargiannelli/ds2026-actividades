-- CreateTable
CREATE TABLE "Autor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nacionalidad" TEXT NOT NULL,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Libro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriaToLibro" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoriaToLibro_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Autor_nombre_key" ON "Autor"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE INDEX "_CategoriaToLibro_B_index" ON "_CategoriaToLibro"("B");

-- AddForeignKey
ALTER TABLE "Libro" ADD CONSTRAINT "Libro_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToLibro" ADD CONSTRAINT "_CategoriaToLibro_A_fkey" FOREIGN KEY ("A") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriaToLibro" ADD CONSTRAINT "_CategoriaToLibro_B_fkey" FOREIGN KEY ("B") REFERENCES "Libro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
