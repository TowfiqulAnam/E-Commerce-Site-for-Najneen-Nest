CREATE TABLE `store_state` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`payload` text NOT NULL
);
