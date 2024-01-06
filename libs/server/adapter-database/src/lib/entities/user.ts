import { relations } from 'drizzle-orm';
import { pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { userSessions } from './user-session';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  }
);

export const usersRelations = relations(users, ({ one }) => ({
  userSession: one(userSessions),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
