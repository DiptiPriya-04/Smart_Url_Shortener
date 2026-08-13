ALTER TABLE "url_analytics" DROP CONSTRAINT "url_analytics_url_id_urls_id_fk";
--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "url_analytics" ADD CONSTRAINT "url_analytics_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;