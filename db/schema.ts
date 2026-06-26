import {
  mysqlTable,
  mysqlEnum,
  varchar,
  int,
  decimal,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Users table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }).unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image", { length: 191 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Accounts table (for OAuth)
export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 191 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// Sessions table
export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 191 }).primaryKey(),
  userId: varchar("userId", { length: 191 }).notNull(),
  expires: timestamp("expires").notNull(),
});

// Verification tokens table
export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Executions table
export const executions = mysqlTable("executions", {
  id: varchar("id", { length: 191 }).primaryKey(),
  processNumber: varchar("processNumber", { length: 50 }).unique().notNull(),
  internalId: varchar("internalId", { length: 50 }).unique(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientDocument: varchar("clientDocument", { length: 20 }),
  claimValue: decimal("claimValue", { precision: 15, scale: 2 }).notNull(),
  recoveredValue: decimal("recoveredValue", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", [
    "active",
    "suspended",
    "concluded",
    "archived",
  ]).default("active"),
  court: varchar("court", { length: 255 }),
  judge: varchar("judge", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Tasks table
export const tasks = mysqlTable("tasks", {
  id: varchar("id", { length: 191 }).primaryKey(),
  executionId: varchar("executionId", { length: 191 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "completed"]).default(
    "todo"
  ),
  dueDate: timestamp("dueDate"),
  assignedTo: varchar("assignedTo", { length: 191 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Agreements table
export const agreements = mysqlTable("agreements", {
  id: varchar("id", { length: 191 }).primaryKey(),
  executionId: varchar("executionId", { length: 191 }).notNull(),
  agreedValue: decimal("agreedValue", { precision: 15, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "active",
    "completed",
    "failed",
  ]).default("pending"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Import logs table
export const importLogs = mysqlTable("importLogs", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("userId", { length: 191 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  totalRecords: int("totalRecords").notNull(),
  importedRecords: int("importedRecords").notNull(),
  duplicateRecords: int("duplicateRecords").notNull(),
  errorRecords: int("errorRecords").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default(
    "pending"
  ),
  createdAt: timestamp("createdAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  tasks: many(tasks),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const executionsRelations = relations(executions, ({ many }) => ({
  tasks: many(tasks),
  agreements: many(agreements),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  execution: one(executions, {
    fields: [tasks.executionId],
    references: [executions.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
}));

export const agreementsRelations = relations(agreements, ({ one }) => ({
  execution: one(executions, {
    fields: [agreements.executionId],
    references: [executions.id],
  }),
}));
