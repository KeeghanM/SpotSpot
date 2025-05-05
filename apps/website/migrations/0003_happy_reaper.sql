ALTER TABLE `spot` RENAME COLUMN "link" TO "location_name";--> statement-breakpoint
ALTER TABLE `spot` ADD `location_address` text;--> statement-breakpoint
ALTER TABLE `spot` ADD `location_link` text;