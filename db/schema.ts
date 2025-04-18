import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

// User Table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  role: text("role"),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// Session Table
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

// Account Table
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Candidate Table
export const candidate = pgTable("candidate", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Vote Table
export const vote = pgTable("vote", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  candidateId: text("candidate_id").notNull().references(() => candidate.id),
  vote: boolean("vote").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Current Candidate Table
export const currentCandidate = pgTable("current_candidate", {
  candidateId: text("candidate_id").primaryKey().notNull().references(() => candidate.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

export const schema = {
  users: user,
  sessions: session,
  accounts: account,
  candidates: candidate,
  votes: vote,
  currentCandidate: currentCandidate,
};