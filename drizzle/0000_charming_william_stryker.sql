CREATE TABLE `badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`required_points` integer NOT NULL,
	`icon_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `badges_name_unique` ON `badges` (`name`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE TABLE `easy_challenges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`quiz_type_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`points` integer DEFAULT 10,
	`answer` text NOT NULL,
	`explanation` text,
	`difficulty` text DEFAULT 'easy',
	`time_limit` integer,
	`options` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quiz_type_id`) REFERENCES `quiz_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hard_challenges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`quiz_type_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`points` integer DEFAULT 30,
	`answer` text NOT NULL,
	`explanation` text,
	`difficulty` text DEFAULT 'hard',
	`time_limit` integer,
	`options` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quiz_type_id`) REFERENCES `quiz_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medium_challenges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`quiz_type_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`points` integer DEFAULT 20,
	`answer` text NOT NULL,
	`explanation` text,
	`difficulty` text DEFAULT 'medium',
	`time_limit` integer,
	`options` text,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quiz_type_id`) REFERENCES `quiz_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quiz_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`challenge_type` text NOT NULL,
	`completed_at` text NOT NULL,
	`score` integer NOT NULL,
	`time_taken` integer,
	`is_correct` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quiz_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`badge_id` integer NOT NULL,
	`earned_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_easy_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`completed` integer DEFAULT 0,
	`completed_at` text,
	`attempts` integer DEFAULT 0,
	`last_attempt` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`challenge_id`) REFERENCES `easy_challenges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_hard_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`completed` integer DEFAULT 0,
	`completed_at` text,
	`attempts` integer DEFAULT 0,
	`last_attempt` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`challenge_id`) REFERENCES `hard_challenges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_medium_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`challenge_id` integer NOT NULL,
	`completed` integer DEFAULT 0,
	`completed_at` text,
	`attempts` integer DEFAULT 0,
	`last_attempt` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`challenge_id`) REFERENCES `medium_challenges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text,
	`total_points` integer DEFAULT 0,
	`rank` text
);
