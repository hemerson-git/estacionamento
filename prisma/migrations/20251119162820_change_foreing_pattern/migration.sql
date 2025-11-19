/*
  Warnings:

  - You are about to drop the column `empresaId_empresa` on the `vaga` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `vaga` DROP FOREIGN KEY `vaga_empresaId_empresa_fkey`;

-- AlterTable
ALTER TABLE `vaga` DROP COLUMN `empresaId_empresa`,
    ADD COLUMN `empresaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `vaga` ADD CONSTRAINT `vaga_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa`(`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;
