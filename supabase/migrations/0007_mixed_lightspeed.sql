CREATE TABLE "current_candidate" (
	"candidate_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "current_candidate" ADD CONSTRAINT "current_candidate_candidate_id_candidate_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidate"("id") ON DELETE no action ON UPDATE no action;