CREATE TABLE `users` (
`id` text PRIMARY KEY NOT NULL,
`name` text,
`email` text UNIQUE,
`emailVerified` integer,
`image` text,
`role` text DEFAULT 'user',
`createdAt` integer DEFAULT (current_timestamp),
`updatedAt` integer DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
`userId` text NOT NULL,
`type` text NOT NULL,
`provider` text NOT NULL,
`providerAccountId` text NOT NULL,
`refresh_token` text,
`access_token` text,
`expires_at` integer,
`token_type` text,
`scope` text,
`id_token` text,
`session_state` text,
PRIMARY KEY(`provider`, `providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
`sessionToken` text PRIMARY KEY NOT NULL,
`userId` text NOT NULL,
`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
`identifier` text NOT NULL,
`token` text NOT NULL,
`expires` integer NOT NULL,
PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `executions` (
`id` text PRIMARY KEY NOT NULL,
`processNumber` text UNIQUE NOT NULL,
`internalId` text UNIQUE,
`clientName` text NOT NULL,
`clientDocument` text,
`claimValue` real NOT NULL,
`recoveredValue` real DEFAULT 0,
`status` text DEFAULT 'active',
`court` text,
`judge` text,
`createdAt` integer DEFAULT (current_timestamp),
`updatedAt` integer DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
`id` text PRIMARY KEY NOT NULL,
`executionId` text NOT NULL,
`title` text NOT NULL,
`description` text,
`status` text DEFAULT 'todo',
`dueDate` integer,
`assignedTo` text,
`createdAt` integer DEFAULT (current_timestamp),
`updatedAt` integer DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `agreements` (
`id` text PRIMARY KEY NOT NULL,
`executionId` text NOT NULL,
`agreedValue` real NOT NULL,
`status` text DEFAULT 'pending',
`startDate` integer,
`endDate` integer,
`notes` text,
`createdAt` integer DEFAULT (current_timestamp),
`updatedAt` integer DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `importLogs` (
`id` text PRIMARY KEY NOT NULL,
`userId` text NOT NULL,
`fileName` text NOT NULL,
`totalRecords` integer NOT NULL,
`importedRecords` integer NOT NULL,
`duplicateRecords` integer NOT NULL,
`errorRecords` integer NOT NULL,
`status` text DEFAULT 'pending',
`createdAt` integer DEFAULT (current_timestamp),
`completedAt` integer
);
