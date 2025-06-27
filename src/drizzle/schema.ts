import { pgTable, uuid, varchar, timestamp, text, primaryKey } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Boards Table
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Collaborators Table
export const collaborators = pgTable("collaborators", {
  boardId: uuid("board_id").references(() => boards.id),
  userId: uuid("user_id").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.boardId, table.userId] }),
}));

// Moves Table
export const moves = pgTable("moves", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").references(() => boards.id),
  userId: uuid("user_id").references(() => users.id),
  data: text("data"), // JSON stringified move
  createdAt: timestamp("created_at").defaultNow(),
});
