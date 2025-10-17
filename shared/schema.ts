import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  photoURL: text("photo_url"),
  lastLogin: timestamp("last_login").defaultNow(),
});

// Events table schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  audience: text("audience"),
});

// Teams table schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation"),
  division: text("division").notNull(),
  logoUrl: text("logo_url"),
});

// Fixtures table schema
export const fixtures = pgTable("fixtures", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  isHome: boolean("is_home").notNull(),
  opposingTeam: text("opposing_team").notNull(),
  opposingTeamAbbreviation: text("opposing_team_abbreviation"),
  opposingTeamColor: text("opposing_team_color"),
  result: jsonb("result"),
});

// Feed items table schema
export const feedItems = pgTable("feed_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
});

// Sponsors table schema
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  website: text("website").notNull(),
  description: text("description"),
  sponsorshipLevel: text("sponsorship_level"),
});

// Notification subscriptions table schema
export const notificationSubscriptions = pgTable("notification_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id"), // Optional user identifier (not currently used)
  fcmToken: text("fcm_token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Instagram posts table schema
export const instagramPosts = pgTable("instagram_posts", {
  id: serial("id").primaryKey(),
  postUrl: text("post_url").notNull(),
  imageUrl: text("image_url"),
  caption: text("caption"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertFixtureSchema = createInsertSchema(fixtures).omit({ id: true });
export const insertFeedItemSchema = createInsertSchema(feedItems).omit({ id: true });
export const insertSponsorSchema = createInsertSchema(sponsors).omit({ id: true });
export const insertNotificationSubscriptionSchema = createInsertSchema(notificationSubscriptions).omit({ id: true, createdAt: true });
export const insertInstagramPostSchema = createInsertSchema(instagramPosts).omit({ id: true, createdAt: true });

// Typed exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type Fixture = typeof fixtures.$inferSelect;

export type InsertFeedItem = z.infer<typeof insertFeedItemSchema>;
export type FeedItem = typeof feedItems.$inferSelect;

export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsors.$inferSelect;

export type InsertNotificationSubscription = z.infer<typeof insertNotificationSubscriptionSchema>;
export type NotificationSubscription = typeof notificationSubscriptions.$inferSelect;

export type InsertInstagramPost = z.infer<typeof insertInstagramPostSchema>;
export type InstagramPost = typeof instagramPosts.$inferSelect;
