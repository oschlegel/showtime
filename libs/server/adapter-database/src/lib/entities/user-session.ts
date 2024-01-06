import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const userSessions = pgTable(
  'user_sessions',
  {
    id: serial('id').primaryKey(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('token_idx').on(table.token),
    };
  }
);

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
