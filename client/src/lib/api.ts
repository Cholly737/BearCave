import { apiRequest } from "./queryClient";
import { Event, Team, Fixture, FeedItem } from "@/types";
import { type Sponsor } from "@shared/schema";

// Events API
export const fetchUpcomingEvents = async (): Promise<Event[]> => {
  const res = await apiRequest("GET", "/api/events", undefined);
  return res.json();
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const res = await apiRequest("GET", `/api/events/${id}`, undefined);
  return res.json();
};

// Feed API
export const fetchFeedItems = async (): Promise<FeedItem[]> => {
  const res = await apiRequest("GET", "/api/feed", undefined);
  return res.json();
};

export const fetchLatestFeedItem = async (): Promise<FeedItem> => {
  const res = await apiRequest("GET", "/api/feed/latest", undefined);
  return res.json();
};

// Teams API
export const fetchTeams = async (): Promise<Team[]> => {
  const res = await apiRequest("GET", "/api/teams", undefined);
  return res.json();
};

export const fetchTeamDetails = async (teamId: string): Promise<Team> => {
  const res = await apiRequest("GET", `/api/teams/${teamId}`, undefined);
  return res.json();
};

export const fetchTeamFixtures = async (teamId: string): Promise<Fixture[]> => {
  const res = await apiRequest("GET", `/api/teams/${teamId}/fixtures`, undefined);
  return res.json();
};

// Sponsors API
export const fetchSponsors = async (): Promise<Sponsor[]> => {
  const res = await apiRequest("GET", "/api/sponsors", undefined);
  return res.json();
};

// PlayHQ API Integration
export const fetchPlayHQFixtures = async (teamId: string): Promise<Fixture[]> => {
  const res = await apiRequest("GET", `/api/playhq/fixtures/${teamId}`, undefined);
  return res.json();
};
