// Event type definition
export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  audience?: string;
}

// Team type definition
export interface Team {
  id: string;
  name: string;
  abbreviation?: string;
  division: string;
  logoUrl?: string;
}

// Fixture type definition
export interface Fixture {
  id: string;
  teamId: string;
  date: string;
  location: string;
  isHome: boolean;
  opposingTeam: string;
  opposingTeamAbbreviation?: string;
  opposingTeamColor?: string;
  result?: {
    homeScore?: number;
    awayScore?: number;
    status: "scheduled" | "in-progress" | "completed" | "postponed" | "cancelled";
  };
}

// Feed item type definition
export interface FeedItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  imageUrl?: string;
  tags?: string[];
}

// Sponsor type definition
export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  description?: string;
  sponsorshipLevel?: string;
}

// User type definition
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
