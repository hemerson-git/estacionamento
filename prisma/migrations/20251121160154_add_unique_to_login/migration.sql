/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `empresa_cnpj_key` ON `empresa`;

-- CreateIndex
CREATE UNIQUE INDEX `usuario_login_key` ON `usuario`(`login`);
