/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Veiculo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Cliente`;

-- DropTable
DROP TABLE `Veiculo`;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `login` VARCHAR(20) NOT NULL,
    `senhaHash` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa` (
    `id_empresa` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` CHAR(14) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `endereco` VARCHAR(100) NOT NULL,
    `telefone` CHAR(11) NOT NULL,
    `numero_vagas` INTEGER NOT NULL,
    `valor_hora` DECIMAL(10, 0) NULL,

    PRIMARY KEY (`id_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `placa` CHAR(7) NOT NULL,
    `modelo` VARCHAR(50) NOT NULL,
    `cor` VARCHAR(50) NOT NULL,
    `nome_cliente` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaga` (
    `id_vaga` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` INTEGER NOT NULL,
    `status` ENUM('LIVRE', 'OCUPADA') NOT NULL DEFAULT 'LIVRE',
    `tipo` ENUM('MOTO', 'CARRO') NOT NULL,

    PRIMARY KEY (`id_vaga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Veiculo_vaga` (
    `id_veiculo` INTEGER NOT NULL,
    `id_vaga` INTEGER NOT NULL,
    `hora_entrada` DATETIME(3) NOT NULL,
    `hora_saida` DATETIME(3) NULL,

    INDEX `fk_id_vaga`(`id_vaga`),
    PRIMARY KEY (`id_veiculo`, `id_vaga`, `hora_entrada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Veiculo_vaga` ADD CONSTRAINT `Veiculo_vaga_id_veiculo_fkey` FOREIGN KEY (`id_veiculo`) REFERENCES `veiculo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veiculo_vaga` ADD CONSTRAINT `Veiculo_vaga_id_vaga_fkey` FOREIGN KEY (`id_vaga`) REFERENCES `vaga`(`id_vaga`) ON DELETE RESTRICT ON UPDATE CASCADE;
