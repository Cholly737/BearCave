import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  teams, type Team, type InsertTeam,
  fixtures, type Fixture, type InsertFixture,
  feedItems, type FeedItem, type InsertFeedItem,
  sponsors, type Sponsor, type InsertSponsor,
  notificationSubscriptions, type NotificationSubscription, type InsertNotificationSubscription,
  instagramPosts, type InstagramPost, type InsertInstagramPost
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  
  // Team methods
  getAllTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team | undefined>;
  
  // Fixture methods
  getFixturesByTeamId(teamId: string): Promise<Fixture[]>;
  
  // Feed methods
  getAllFeedItems(): Promise<FeedItem[]>;
  
  // Sponsor methods
  getAllSponsors(): Promise<Sponsor[]>;
  
  // Notification subscription methods
  subscribeToNotifications(subscription: InsertNotificationSubscription): Promise<NotificationSubscription>;
  unsubscribeFromNotifications(fcmToken: string): Promise<boolean>;
  getAllActiveSubscriptions(): Promise<NotificationSubscription[]>;
  
  // Instagram post methods
  getActiveInstagramPosts(): Promise<InstagramPost[]>;
  
  // Data initialization method
  initializeData(): Promise<void>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.date));
  }
  
  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, parseInt(id)));
    return event;
  }
  
  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }
  
  async getTeamById(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, parseInt(id)));
    return team;
  }
  
  // Fixture methods
  async getFixturesByTeamId(teamId: string): Promise<Fixture[]> {
    return await db.select().from(fixtures).where(eq(fixtures.teamId, parseInt(teamId)));
  }
  
  // Feed methods
  async getAllFeedItems(): Promise<FeedItem[]> {
    return await db.select().from(feedItems);
  }
  
  // Sponsor methods
  async getAllSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors);
  }
  
  // Instagram post methods
  async getActiveInstagramPosts(): Promise<InstagramPost[]> {
    return await db.select().from(instagramPosts)
      .where(eq(instagramPosts.isActive, true))
      .orderBy(asc(instagramPosts.displayOrder));
  }
  
  // Notification subscription methods
  async subscribeToNotifications(subscription: InsertNotificationSubscription): Promise<NotificationSubscription> {
    // First, check if this token already exists and update it if so
    const existing = await db.select().from(notificationSubscriptions)
      .where(eq(notificationSubscriptions.fcmToken, subscription.fcmToken));
    
    if (existing.length > 0) {
      // Update existing subscription to active
      const [updated] = await db.update(notificationSubscriptions)
        .set({ 
          isActive: true, 
          userId: subscription.userId || existing[0].userId 
        })
        .where(eq(notificationSubscriptions.fcmToken, subscription.fcmToken))
        .returning();
      return updated;
    } else {
      // Create new subscription
      const [created] = await db.insert(notificationSubscriptions)
        .values(subscription)
        .returning();
      return created;
    }
  }

  async unsubscribeFromNotifications(fcmToken: string): Promise<boolean> {
    const result = await db.update(notificationSubscriptions)
      .set({ isActive: false })
      .where(eq(notificationSubscriptions.fcmToken, fcmToken));
    
    return (result.rowCount ?? 0) > 0;
  }

  async getAllActiveSubscriptions(): Promise<NotificationSubscription[]> {
    return await db.select().from(notificationSubscriptions)
      .where(eq(notificationSubscriptions.isActive, true));
  }
  
  // Initialize with sample data for development
  async initializeData(): Promise<void> {
    try {
      // Check if we already have data
      const existingEvents = await db.select().from(events);
      if (existingEvents.length > 0) {
        console.log("Database already initialized, skipping...");
        return;
      }

      console.log("Initializing database with sample data...");
      
      // Add sample events
      const sampleEvents: InsertEvent[] = [
        {
          name: "Bears Rodeo",
          description: "Don your finest denim and cowboy hats for a mechanical bull ride",
          date: new Date("2025-10-11"),
          time: "TBC",
          location: "Stradbroke Park",
        },
        {
          name: "DBCC Presents: Community movie night",
          description: "Movie to be confirmed",
          date: new Date("2025-11-01"),
          time: "TBC",
          location: "Deepdene Park",
        },
        {
          name: "Holiday Potluck",
          description: "Pull up at Deepy with a plate for a holiday meal - Bears Style",
          date: new Date("2025-12-13"),
          time: "TBC",
          location: "Deepdene Park",
        },
      {
        name: "Exhibition Game",
        description: "Part 1 of Super Sunday at Straddy, followed by Auction Night",
        date: new Date("2026-1-25"),
        time: "2:00PM",
        location: "Stradbroke Park",
      },
      {
        name: "Auction Night",
        description: "Part 2 of Super Sunday at Straddy, after the Exhibition Game",
        date: new Date("2026-1-25"),
        time: "5:00PM",
        location: "Stradbroke Park",
      },
      {
        name: "School Sports Night",
        description: "Dust off your primary school polos to earn some house points",
        date: new Date("2026-2-21"),
        time: "TBC",
        location: "Stradbroke Park"
      }
      ];

      await db.insert(events).values(sampleEvents);
      
      // Add sample teams
      const sampleTeams: InsertTeam[] = [
        {
          name: "Men's 1st XI",
          abbreviation: "1XI",
          division: "Wright Shield",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Women's 1st XI",
          abbreviation: "W1XI",
          division: "EGWC Senior Women B Grade",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Men's 2nd XI - A Turf",
          abbreviation: "2XI",
          division: "Sturgess Shield",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Women's Social",
          abbreviation: "WSoc",
          division: "EGWC Senior Women Social A",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Men's 3rd XI - E Turf",
          abbreviation: "3XI",
          division: "Charles Cohen Shield",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Under 12s",
          abbreviation: "U12",
          division: "U12 B Grade G Smith",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Men's 4th XI - F Turf",
          abbreviation: "4XI",
          division: "Rodney Patterson Shield",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Men's T20",
          abbreviation: "T20",
          division: "Kookaburra Senior Mixed T20",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Men's Sunday",
          abbreviation: "MSun",
          division: "C South",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Under 13s",
          abbreviation: "U13",
          division: "Under 13 - Wilson Shield",
          logoUrl: "https://via.placeholder.com/150"
        }
      ];
      
      const insertedTeams = await db.insert(teams).values(sampleTeams).returning();
      
      // Add sample fixtures
      const sampleFixtures: InsertFixture[] = [
        // First XI fixtures
        {
          teamId: insertedTeams[0].id,
          date: new Date("2025-06-01T14:00:00"),
          location: "Deepdene Cricket Ground",
          isHome: true,
          opposingTeam: "Canterbury Crusaders",
          opposingTeamAbbreviation: "CC",
          opposingTeamColor: "#3B82F6"
        },
        {
          teamId: insertedTeams[0].id,
          date: new Date("2025-06-08T13:00:00"),
          location: "Balwyn Sports Complex",
          isHome: false,
          opposingTeam: "Balwyn Tigers",
          opposingTeamAbbreviation: "BT",
          opposingTeamColor: "#F59E0B"
        },
        // Winter XI fixtures (Mamgain Shield)
        {
          teamId: insertedTeams[1].id,
          date: new Date("2025-06-07T14:00:00"),
          location: "Deepdene Cricket Ground",
          isHome: true,
          opposingTeam: "North Balwyn Knights",
          opposingTeamAbbreviation: "NBK",
          opposingTeamColor: "#2E8B57"
        },
        {
          teamId: insertedTeams[1].id,
          date: new Date("2025-06-14T13:30:00"),
          location: "Camberwell Sports Ground",
          isHome: false,
          opposingTeam: "Camberwell Cobras",
          opposingTeamAbbreviation: "CC",
          opposingTeamColor: "#8B0000"
        },
        {
          teamId: insertedTeams[1].id,
          date: new Date("2025-06-21T14:00:00"),
          location: "Deepdene Cricket Ground",
          isHome: true,
          opposingTeam: "Kew Raptors",
          opposingTeamAbbreviation: "KR",
          opposingTeamColor: "#6D28D9"
        },
        {
          teamId: insertedTeams[1].id,
          date: new Date("2025-06-28T13:00:00"),
          location: "Hawthorn Cricket Club",
          isHome: false,
          opposingTeam: "Hawthorn Hawks",
          opposingTeamAbbreviation: "HH",
          opposingTeamColor: "#FFD700"
        },
        // Second XI fixtures
        {
          teamId: insertedTeams[2].id,
          date: new Date("2025-06-01T10:00:00"),
          location: "Balwyn Sports Complex",
          isHome: false,
          opposingTeam: "Balwyn Tigers",
          opposingTeamAbbreviation: "BT",
          opposingTeamColor: "#F59E0B"
        },
        // Women's team fixtures
        {
          teamId: insertedTeams[3].id,
          date: new Date("2025-06-02T15:00:00"),
          location: "Deepdene Cricket Ground",
          isHome: true,
          opposingTeam: "Kew Raptors Women",
          opposingTeamAbbreviation: "KRW",
          opposingTeamColor: "#6D28D9"
        }
      ];
      
      await db.insert(fixtures).values(sampleFixtures);
      
      // Add sample feed items - commented out to show empty state
      // const sampleFeedItems: InsertFeedItem[] = [
      //   {
      //     title: "Training Cancelled Tonight",
      //     content: "Due to severe weather conditions, all training sessions for today have been cancelled. Stay safe everyone!",
      //     date: new Date("2025-05-12T09:00:00"),
      //     type: "notification",
      //     tags: ["training", "weather"]
      //   }
      // ];
      
      // await db.insert(feedItems).values(sampleFeedItems);
      
      // Add sample sponsors
      const sampleSponsors: InsertSponsor[] = [
        {
          name: "Knight FM",
          logoUrl: "/attached_assets/KFM-Logo_1756618276456.avif",
          website: "https://knightfm.com.au/",
          description: "Knight FM provide integrated facilities management to organisations across Australia and New Zealand.",
          sponsorshipLevel: "Gold"
        },
        {
          name: "Winequip",
          logoUrl: "/attached_assets/winequip_1756618805193.avif",
          website: "https://winequip.com.au/",
          description: "Winequip is your key wine and beverage industry supplier in Australia and New Zealand, representing the world’s leading brands in beverage equipment and consumables.",
          sponsorshipLevel: "Gold"
        },
        {
          name: "GA Fire",
          logoUrl: "/attached_assets/GA fire_1756618805193.avif",
          website: "https://gafire.com.au/",
          description: "GA Fire is a Melbourne based fire protection company with over 100 years combined experience in design, installation and service maintenance of all types of fire protection systems",
          sponsorshipLevel: "Silver"
        },
        {
          name: "Bendigo Bank",
          logoUrl: "/attached_assets/bendigo bank_1756618805192.avif",
          website: "https://www.bendigobank.com.au/",
          description: "Bendigo Bank is trusted by millions of Australians with their banking needs every day.",
          sponsorshipLevel: "Silver"
        },
        {
          name: "Sustainable Tree Management",
          logoUrl: "/attached_assets/sustainable tree management_1756618805192.avif",
          website: "http://sustainabletm.com.au/",          description: "Providing professional and high quality arboricultural, ecological and other environmental consulting services.",
          sponsorshipLevel: "Silver"
        },
        {
          name: "Ramsay Surgical Centre Glenferrie",
          logoUrl: "/attached_assets/ramsay_1756618805192.avif",
          website: "https://www.ramsaysurgicalcentreglenferrie.com.au/",
          description: "Ramsay Surgical Centre is a modern, short-stay surgical facility located in the leafy heart of Hawthorn.",
          sponsorshipLevel: "Bronze"
        },
        {
          name: "XMG Media",
          logoUrl: "/attached_assets/XMG_1756618805191.avif",
          website: "https://xmgmediaww.com.au/",
          description: "XMG Media is a digital media and marketing agency specializing in innovative solutions.",
          sponsorshipLevel: "Bronze"
        },
        {
          name: "Elgin",
          logoUrl: "/attached_assets/elgin_1756618805191.avif",
          website: "#",
          description: "Elgin is a proud supporter of Deepdene Bears Cricket Club.",
          sponsorshipLevel: "Bronze"
        },
        {
          name: "GB",
          logoUrl: "/attached_assets/GB_1756618805190.avif",
          website: "#",
          description: "GB is a proud supporter of Deepdene Bears Cricket Club.",
          sponsorshipLevel: "Bronze"
        },
        {
          name: "Angle House",
          logoUrl: "/attached_assets/Angle house_1756618805191.avif",
          website: "#",
          description: "Angle House is a proud supporter of Deepdene Bears Cricket Club.",
          sponsorshipLevel: "Bronze"
        },
      ];
      
      await db.insert(sponsors).values(sampleSponsors);
      
      // Add sample Instagram posts (using placeholder URLs - replace with actual post URLs)
      const sampleInstagramPosts: InsertInstagramPost[] = [
        {
          postUrl: "https://www.instagram.com/p/C_example1/",
          displayOrder: 1,
          isActive: true
        },
        {
          postUrl: "https://www.instagram.com/p/C_example2/",
          displayOrder: 2,
          isActive: true
        },
        {
          postUrl: "https://www.instagram.com/p/C_example3/",
          displayOrder: 3,
          isActive: true
        }
      ];
      
      await db.insert(instagramPosts).values(sampleInstagramPosts);
      
      console.log("Database initialization complete!");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
