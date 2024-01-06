import { index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { titles } from './title';
import { users } from './user';

export const favourites = pgTable(
  'favourites',
  {
    titleId: text('title_id')
      .references(() => titles.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.titleId, table.userId] }),
      userIdx: index('favourite_user_idx').on(table.userId),
    };
  }
);

export type Favourite = typeof favourites.$inferSelect;
export type NewFavourite = typeof favourites.$inferInsert;
