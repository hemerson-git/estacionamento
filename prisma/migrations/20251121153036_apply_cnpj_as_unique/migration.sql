/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placa]` on the table `veiculo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `empresa_cnpj_key` ON `empresa`(`cnpj`);

-- CreateIndex
CREATE UNIQUE INDEX `veiculo_placa_key` ON `veiculo`(`placa`);
