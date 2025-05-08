import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  teams, type Team, type InsertTeam,
  fixtures, type Fixture, type InsertFixture,
  feedItems, type FeedItem, type InsertFeedItem,
  sponsors, type Sponsor, type InsertSponsor
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<string, Event>;
  private teams: Map<string, Team>;
  private fixtures: Map<string, Fixture>;
  private feedItems: Map<string, FeedItem>;
  private sponsors: Map<string, Sponsor>;
  
  currentId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.teams = new Map();
    this.fixtures = new Map();
    this.feedItems = new Map();
    this.sponsors = new Map();
    
    this.currentId = 1;
    
    // Initialize with mock data
    this.initMockData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventById(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  // Team methods
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  async getTeamById(id: string): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  // Fixture methods
  async getFixturesByTeamId(teamId: string): Promise<Fixture[]> {
    return Array.from(this.fixtures.values()).filter(
      fixture => fixture.teamId.toString() === teamId
    );
  }
  
  // Feed methods
  async getAllFeedItems(): Promise<FeedItem[]> {
    return Array.from(this.feedItems.values());
  }
  
  // Sponsor methods
  async getAllSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsors.values());
  }
  
  // Initialize with mock data for development
  private initMockData() {
    // Add mock events
    const mockEvents: Event[] = [
      {
        id: 1,
        name: "Annual Club Dinner",
        description: "Join us for our annual club dinner and awards night. All players and family members welcome!",
        date: new Date("2025-06-15T18:30:00"),
        time: "6:30 PM",
        location: "Deepdene Community Hall",
        audience: "All club members and families"
      },
      {
        id: 2,
        name: "Junior Registration Day",
        description: "Registration day for all junior teams U10-U16. Please bring ID and registration forms.",
        date: new Date("2025-05-20T10:00:00"),
        time: "10:00 AM - 2:00 PM",
        location: "Deepdene Cricket Ground",
        audience: "Junior players and parents"
      },
      {
        id: 3,
        name: "Cricket Clinic",
        description: "Professional coaching clinic for all club members. Improve your batting, bowling and fielding skills.",
        date: new Date("2025-05-25T09:00:00"),
        time: "9:00 AM - 12:00 PM",
        location: "Deepdene Cricket Nets",
        audience: "All players"
      }
    ];

    mockEvents.forEach(event => {
      this.events.set(event.id.toString(), event);
    });
    
    // Add mock teams
    const mockTeams: Team[] = [
      {
        id: 1,
        name: "Deepdene Bears First XI",
        abbreviation: "DB1",
        division: "Premier Division",
        logoUrl: "https://via.placeholder.com/150"
      },
      {
        id: 2,
        name: "Deepdene Bears Second XI",
        abbreviation: "DB2",
        division: "Division 1",
        logoUrl: "https://via.placeholder.com/150"
      },
      {
        id: 3,
        name: "Deepdene Bears Women",
        abbreviation: "DBW",
        division: "Women's Premier",
        logoUrl: "https://via.placeholder.com/150"
      },
      {
        id: 4,
        name: "Deepdene Under 16",
        abbreviation: "DBU16",
        division: "Junior Division",
        logoUrl: "https://via.placeholder.com/150"
      }
    ];
    
    mockTeams.forEach(team => {
      this.teams.set(team.id.toString(), team);
    });
    
    // Add mock fixtures
    const mockFixtures: Fixture[] = [
      {
        id: 1,
        teamId: 1,
        date: new Date("2025-06-01T14:00:00"),
        location: "Deepdene Cricket Ground",
        isHome: true,
        opposingTeam: "Canterbury Crusaders",
        opposingTeamAbbreviation: "CC",
        opposingTeamColor: "#3B82F6"
      },
      {
        id: 2,
        teamId: 1,
        date: new Date("2025-06-08T13:00:00"),
        location: "Balwyn Sports Complex",
        isHome: false,
        opposingTeam: "Balwyn Tigers",
        opposingTeamAbbreviation: "BT",
        opposingTeamColor: "#F59E0B"
      },
      {
        id: 3,
        teamId: 2,
        date: new Date("2025-06-01T10:00:00"),
        location: "Balwyn Sports Complex",
        isHome: false,
        opposingTeam: "Balwyn Tigers",
        opposingTeamAbbreviation: "BT",
        opposingTeamColor: "#F59E0B"
      },
      {
        id: 4,
        teamId: 3,
        date: new Date("2025-06-02T15:00:00"),
        location: "Deepdene Cricket Ground",
        isHome: true,
        opposingTeam: "Kew Raptors",
        opposingTeamAbbreviation: "KR",
        opposingTeamColor: "#6D28D9"
      }
    ];
    
    mockFixtures.forEach(fixture => {
      this.fixtures.set(fixture.id.toString(), fixture);
    });
    
    // Add mock feed items
    const mockFeedItems: FeedItem[] = [
      {
        id: 1,
        title: "Training Cancelled Tonight",
        content: "Due to severe weather conditions, all training sessions for today have been cancelled. Stay safe everyone!",
        date: new Date("2025-05-12T09:00:00"),
        type: "notification",
        tags: ["training", "weather"]
      },
      {
        id: 2,
        title: "First XI Victory",
        content: "Congratulations to our First XI team for their outstanding victory against Canterbury yesterday! Star performances from John Smith (century) and Mary Jones (5 wickets).",
        date: new Date("2025-05-10T18:30:00"),
        type: "achievement",
        imageUrl: "https://via.placeholder.com/800x400",
        tags: ["match", "victory", "First XI"]
      },
      {
        id: 3,
        title: "New Club Merchandise Available",
        content: "The new club merchandise has arrived! Visit our shop to purchase your Deepdene Bears shirts, caps, and training gear.",
        date: new Date("2025-05-05T12:00:00"),
        type: "merchandise",
        tags: ["shop", "merchandise"]
      }
    ];
    
    mockFeedItems.forEach(item => {
      this.feedItems.set(item.id.toString(), item);
    });
    
    // Add mock sponsors
    const mockSponsors: Sponsor[] = [
      {
        id: 1,
        name: "Community Bank",
        logoUrl: "https://via.placeholder.com/300x200?text=Community+Bank",
        website: "https://example.com/communitybank"
      },
      {
        id: 2,
        name: "Local Sports Shop",
        logoUrl: "https://via.placeholder.com/300x200?text=Sports+Shop",
        website: "https://example.com/sportsshop"
      },
      {
        id: 3,
        name: "City Dental Clinic",
        logoUrl: "https://via.placeholder.com/300x200?text=Dental+Clinic",
        website: "https://example.com/dentalclinic"
      },
      {
        id: 4,
        name: "Max's Restaurant",
        logoUrl: "https://via.placeholder.com/300x200?text=Max+Restaurant",
        website: "https://example.com/maxrestaurant"
      }
    ];
    
    mockSponsors.forEach(sponsor => {
      this.sponsors.set(sponsor.id.toString(), sponsor);
    });
  }
}

export const storage = new MemStorage();
