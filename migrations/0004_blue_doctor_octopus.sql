CREATE TABLE `spot_tag` (
	`id` integer PRIMARY KEY NOT NULL,
	`spot_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`spot_id`) REFERENCES `spot`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
