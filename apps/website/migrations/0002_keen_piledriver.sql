PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_spot` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`visited` integer,
	`rating` integer,
	`notes` text,
	`link` text,
	`listId` integer NOT NULL,
	FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_spot`("id", "name", "visited", "rating", "notes", "link", "listId") SELECT "id", "name", "visited", "rating", "notes", "link", "listId" FROM `spot`;--> statement-breakpoint
DROP TABLE `spot`;--> statement-breakpoint
ALTER TABLE `__new_spot` RENAME TO `spot`;--> statement-breakpoint
PRAGMA foreign_keys=ON;