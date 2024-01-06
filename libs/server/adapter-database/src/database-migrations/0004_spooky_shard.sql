CREATE TABLE IF NOT EXISTS "favourites" (
	"title_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"watched" boolean DEFAULT false NOT NULL,
	CONSTRAINT "favourites_title_id_user_id_pk" PRIMARY KEY("title_id","user_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_idx" ON "favourites" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favourites" ADD CONSTRAINT "favourites_title_id_titles_id_fk" FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favourites" ADD CONSTRAINT "favourites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
