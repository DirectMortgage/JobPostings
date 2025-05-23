import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: text("is_admin").default("false"),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // full-time, part-time, contract, internship
  salary: text("salary").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  niceToHave: text("nice_to_have").default(""),
  postedDate: text("posted_date").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedDate: true,
});

export const updateJobSchema = createInsertSchema(jobs).omit({
  postedDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
export type Job = typeof jobs.$inferSelect;
