-- AlterTable
ALTER TABLE `veiculo` ADD COLUMN `empresaId_empresa` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `veiculo` ADD CONSTRAINT `veiculo_empresaId_empresa_fkey` FOREIGN KEY (`empresaId_empresa`) REFERENCES `empresa`(`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE;
