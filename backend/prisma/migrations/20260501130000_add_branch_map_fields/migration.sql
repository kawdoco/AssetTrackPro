ALTER TABLE `branch`
  ADD COLUMN `map_center_lat` DOUBLE NULL,
  ADD COLUMN `map_center_lng` DOUBLE NULL,
  ADD COLUMN `map_zoom` INTEGER NOT NULL DEFAULT 17,
  ADD COLUMN `boundary_points` JSON NULL,
  ADD COLUMN `gate_markers` JSON NULL,
  ADD COLUMN `map_updated_at` DATETIME(3) NULL;
