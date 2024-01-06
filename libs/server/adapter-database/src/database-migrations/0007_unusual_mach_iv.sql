DROP INDEX IF EXISTS "user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "watch_user_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favourite_user_idx" ON "favourites" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "watch_user_idx" ON "watches" ("user_id");