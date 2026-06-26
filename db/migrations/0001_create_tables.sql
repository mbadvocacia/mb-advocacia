CREATE TABLE `users` (
`id` varchar(191) PRIMARY KEY NOT NULL,
`name` varchar(191),
`email` varchar(191) UNIQUE,
`emailVerified` timestamp,
`image` varchar(191),
`role` enum('admin','user') DEFAULT 'user',
`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `accounts` (
`userId` varchar(191) NOT NULL,
`type` varchar(191) NOT NULL,
`provider` varchar(191) NOT NULL,
`providerAccountId` varchar(191) NOT NULL,
`refresh_token` text,
`access_token` text,
`expires_at` int,
`token_type` varchar(191),
`scope` varchar(191),
`id_token` text,
`session_state` varchar(191),
PRIMARY KEY(`provider`, `providerAccountId`)
);

CREATE TABLE `sessions` (
`sessionToken` varchar(191) PRIMARY KEY NOT NULL,
`userId` varchar(191) NOT NULL,
`expires` timestamp NOT NULL
);

CREATE TABLE `verificationToken` (
`identifier` varchar(191) NOT NULL,
`token` varchar(191) NOT NULL,
`expires` timestamp NOT NULL,
PRIMARY KEY(`identifier`, `token`)
);

CREATE TABLE `executions` (
`id` varchar(191) PRIMARY KEY NOT NULL,
`processNumber` varchar(50) UNIQUE NOT NULL,
`internalId` varchar(50) UNIQUE,
`clientName` varchar(255) NOT NULL,
`clientDocument` varchar(20),
`claimValue` decimal(15,2) NOT NULL,
`recoveredValue` decimal(15,2) DEFAULT 0,
`status` enum('active','suspended','concluded','archived') DEFAULT 'active',
`court` varchar(255),
`judge` varchar(255),
`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `tasks` (
`id` varchar(191) PRIMARY KEY NOT NULL,
`executionId` varchar(191) NOT NULL,
`title` varchar(255) NOT NULL,
`description` text,
`status` enum('todo','in_progress','completed') DEFAULT 'todo',
`dueDate` timestamp,
`assignedTo` varchar(191),
`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `agreements` (
`id` varchar(191) PRIMARY KEY NOT NULL,
`executionId` varchar(191) NOT NULL,
`agreedValue` decimal(15,2) NOT NULL,
`status` enum('pending','active','completed','failed') DEFAULT 'pending',
`startDate` timestamp,
`endDate` timestamp,
`notes` text,
`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `importLogs` (
`id` varchar(191) PRIMARY KEY NOT NULL,
`userId` varchar(191) NOT NULL,
`fileName` varchar(255) NOT NULL,
`totalRecords` int NOT NULL,
`importedRecords` int NOT NULL,
`duplicateRecords` int NOT NULL,
`errorRecords` int NOT NULL,
`status` enum('pending','processing','completed','failed') DEFAULT 'pending',
`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
`completedAt` timestamp
);
