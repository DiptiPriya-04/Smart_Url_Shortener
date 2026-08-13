CREATE TABLE "url_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"region" varchar(100),
	"country" varchar(100),
	"city" varchar(100),
	"device_type" varchar(50),
	"browser" varchar(100),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "url_analytics" ADD CONSTRAINT "url_analytics_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE no action ON UPDATE no action;