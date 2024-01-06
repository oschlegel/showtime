import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function migrateDatabase() {
  const sql = postgres('postgres://postgres:postgres@0.0.0.0:5432/postgres', {
    max: 1,
  });
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: 'database-migrations' });

  await sql.end();
}

migrateDatabase();
