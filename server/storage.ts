import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  teams, type Team, type InsertTeam,
  fixtures, type Fixture, type InsertFixture,
  feedItems, type FeedItem, type InsertFeedItem,
  sponsors, type Sponsor, type InsertSponsor
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
    return await db.select().from(events);
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
          name: "Annual Club Dinner",
          description: "Join us for our annual club dinner and awards night. All players and family members welcome!",
          date: new Date("2025-06-15T18:30:00"),
          time: "6:30 PM",
          location: "Deepdene Community Hall",
          audience: "All club members and families"
        },
        {
          name: "Junior Registration Day",
          description: "Registration day for all junior teams U10-U16. Please bring ID and registration forms.",
          date: new Date("2025-05-20T10:00:00"),
          time: "10:00 AM - 2:00 PM",
          location: "Deepdene Cricket Ground",
          audience: "Junior players and parents"
        },
        {
          name: "Cricket Clinic",
          description: "Professional coaching clinic for all club members. Improve your batting, bowling and fielding skills.",
          date: new Date("2025-05-25T09:00:00"),
          time: "9:00 AM - 12:00 PM",
          location: "Deepdene Cricket Nets",
          audience: "All players"
        }
      ];

      await db.insert(events).values(sampleEvents);
      
      // Add sample teams
      const sampleTeams: InsertTeam[] = [
        {
          name: "Deepdene Bears First XI",
          abbreviation: "DB1",
          division: "Premier Division",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Deepdene Bears Second XI",
          abbreviation: "DB2",
          division: "Division 1",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Deepdene Bears Women",
          abbreviation: "DBW",
          division: "Women's Premier",
          logoUrl: "https://via.placeholder.com/150"
        },
        {
          name: "Deepdene Under 16",
          abbreviation: "DBU16",
          division: "Junior Division",
          logoUrl: "https://via.placeholder.com/150"
        }
      ];
      
      const insertedTeams = await db.insert(teams).values(sampleTeams).returning();
      
      // Add sample fixtures
      const sampleFixtures: InsertFixture[] = [
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
        {
          teamId: insertedTeams[1].id,
          date: new Date("2025-06-01T10:00:00"),
          location: "Balwyn Sports Complex",
          isHome: false,
          opposingTeam: "Balwyn Tigers",
          opposingTeamAbbreviation: "BT",
          opposingTeamColor: "#F59E0B"
        },
        {
          teamId: insertedTeams[2].id,
          date: new Date("2025-06-02T15:00:00"),
          location: "Deepdene Cricket Ground",
          isHome: true,
          opposingTeam: "Kew Raptors",
          opposingTeamAbbreviation: "KR",
          opposingTeamColor: "#6D28D9"
        }
      ];
      
      await db.insert(fixtures).values(sampleFixtures);
      
      // Add sample feed items
      const sampleFeedItems: InsertFeedItem[] = [
        {
          title: "Training Cancelled Tonight",
          content: "Due to severe weather conditions, all training sessions for today have been cancelled. Stay safe everyone!",
          date: new Date("2025-05-12T09:00:00"),
          type: "notification",
          tags: ["training", "weather"]
        },
        {
          title: "First XI Victory",
          content: "Congratulations to our First XI team for their outstanding victory against Canterbury yesterday! Star performances from John Smith (century) and Mary Jones (5 wickets).",
          date: new Date("2025-05-10T18:30:00"),
          type: "achievement",
          imageUrl: "https://via.placeholder.com/800x400",
          tags: ["match", "victory", "First XI"]
        },
        {
          title: "New Club Merchandise Available",
          content: "The new club merchandise has arrived! Visit our shop to purchase your Deepdene Bears shirts, caps, and training gear.",
          date: new Date("2025-05-05T12:00:00"),
          type: "merchandise",
          tags: ["shop", "merchandise"]
        }
      ];
      
      await db.insert(feedItems).values(sampleFeedItems);
      
      // Add sample sponsors
      const sampleSponsors: InsertSponsor[] = [
        {
          name: "Community Bank",
          logoUrl: "https://via.placeholder.com/300x200?text=Community+Bank",
          website: "https://example.com/communitybank"
        },
        {
          name: "Local Sports Shop",
          logoUrl: "https://via.placeholder.com/300x200?text=Sports+Shop",
          website: "https://example.com/sportsshop"
        },
        {
          name: "City Dental Clinic",
          logoUrl: "https://via.placeholder.com/300x200?text=Dental+Clinic",
          website: "https://example.com/dentalclinic"
        },
        {
          name: "Max's Restaurant",
          logoUrl: "https://via.placeholder.com/300x200?text=Max+Restaurant",
          website: "https://example.com/maxrestaurant"
        }
      ];
      
      await db.insert(sponsors).values(sampleSponsors);
      
      console.log("Database initialization complete!");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
