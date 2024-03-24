import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as favouriteSchema from './entities/favourite';
import * as titleSchema from './entities/title';
import * as userSchema from './entities/user';
import * as userSessionSchema from './entities/user-session';
import * as watchSchema from './entities/watch';

const client = postgres('postgres://postgres:postgres@0.0.0.0:5433/postgres');

export const db = drizzle(client, {
  schema: {
    ...favouriteSchema,
    ...titleSchema,
    ...userSchema,
    ...userSessionSchema,
    ...watchSchema,
  },
});
