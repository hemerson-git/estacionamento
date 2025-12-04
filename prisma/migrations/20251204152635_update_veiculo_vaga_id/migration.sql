/*
  Warnings:

  - The primary key for the `Veiculo_vaga` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Veiculo_vaga` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`hora_entrada`, `id_veiculo`, `id_vaga`);
