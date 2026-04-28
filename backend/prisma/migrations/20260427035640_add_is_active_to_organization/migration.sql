/*
  Warnings:

  - The primary key for the `alert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `alert` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `asset_id` on the `alert` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `event_id` on the `alert` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `organization_id` on the `asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `last_seen_zone_id` on the `asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `asset_assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `asset_assignment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `asset_id` on the `asset_assignment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `employee_id` on the `asset_assignment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `branch` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `organization_id` on the `branch` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `building` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `branch_id` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `organization_id` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `gate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `gate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `zone_id` on the `gate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `movement_event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `movement_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `asset_id` on the `movement_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `gate_id` on the `movement_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `zone_from_id` on the `movement_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `zone_to_id` on the `movement_event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `organization` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `organization_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `zone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `zone` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `building_id` on the `zone` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `alert` DROP FOREIGN KEY `alert_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `alert` DROP FOREIGN KEY `alert_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `asset_last_seen_zone_id_fkey`;

-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `asset_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `asset_assignment` DROP FOREIGN KEY `asset_assignment_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `asset_assignment` DROP FOREIGN KEY `asset_assignment_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `branch` DROP FOREIGN KEY `branch_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `building` DROP FOREIGN KEY `building_branch_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `employee_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `gate` DROP FOREIGN KEY `gate_zone_id_fkey`;

-- DropForeignKey
ALTER TABLE `movement_event` DROP FOREIGN KEY `movement_event_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `movement_event` DROP FOREIGN KEY `movement_event_gate_id_fkey`;

-- DropForeignKey
ALTER TABLE `movement_event` DROP FOREIGN KEY `movement_event_zone_from_id_fkey`;

-- DropForeignKey
ALTER TABLE `movement_event` DROP FOREIGN KEY `movement_event_zone_to_id_fkey`;

-- DropForeignKey
ALTER TABLE `zone` DROP FOREIGN KEY `zone_building_id_fkey`;

-- DropIndex
DROP INDEX `alert_event_id_fkey` ON `alert`;

-- DropIndex
DROP INDEX `asset_last_seen_zone_id_fkey` ON `asset`;

-- AlterTable
ALTER TABLE `alert` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `asset_id` INTEGER NOT NULL,
    MODIFY `event_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `asset` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `organization_id` INTEGER NOT NULL,
    MODIFY `last_seen_zone_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `asset_assignment` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `asset_id` INTEGER NOT NULL,
    MODIFY `employee_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `branch` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `organization_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `building` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `branch_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `employee` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `organization_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `gate` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `zone_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `movement_event` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `asset_id` INTEGER NOT NULL,
    MODIFY `gate_id` INTEGER NOT NULL,
    MODIFY `zone_from_id` INTEGER NOT NULL,
    MODIFY `zone_to_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `organization` DROP PRIMARY KEY,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `organization_id` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `zone` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `building_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `branch` ADD CONSTRAINT `branch_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `building` ADD CONSTRAINT `building_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zone` ADD CONSTRAINT `zone_building_id_fkey` FOREIGN KEY (`building_id`) REFERENCES `building`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gate` ADD CONSTRAINT `gate_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_last_seen_zone_id_fkey` FOREIGN KEY (`last_seen_zone_id`) REFERENCES `zone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_assignment` ADD CONSTRAINT `asset_assignment_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_assignment` ADD CONSTRAINT `asset_assignment_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement_event` ADD CONSTRAINT `movement_event_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement_event` ADD CONSTRAINT `movement_event_gate_id_fkey` FOREIGN KEY (`gate_id`) REFERENCES `gate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement_event` ADD CONSTRAINT `movement_event_zone_from_id_fkey` FOREIGN KEY (`zone_from_id`) REFERENCES `zone`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movement_event` ADD CONSTRAINT `movement_event_zone_to_id_fkey` FOREIGN KEY (`zone_to_id`) REFERENCES `zone`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert` ADD CONSTRAINT `alert_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alert` ADD CONSTRAINT `alert_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `movement_event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
