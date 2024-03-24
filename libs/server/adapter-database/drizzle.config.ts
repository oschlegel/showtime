import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/entities/*.ts',
  out: './src/database-migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgres://postgres:postgres@0.0.0.0:5433/db',
  },
  verbose: true,
  strict: true,
});
