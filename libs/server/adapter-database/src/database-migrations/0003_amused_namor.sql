CREATE TABLE IF NOT EXISTS "titles" (
	"id" text PRIMARY KEY NOT NULL,
	"data" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
