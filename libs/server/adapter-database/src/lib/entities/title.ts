import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const titles = pgTable('titles', {
  id: text('id').primaryKey(),
  data: json('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export type Title = typeof titles.$inferSelect;
export type NewTitle = typeof titles.$inferInsert;
