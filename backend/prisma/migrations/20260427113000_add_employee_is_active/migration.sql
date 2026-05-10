ALTER TABLE `employee`
ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX `employee_is_active_idx` ON `employee` (`is_active`);