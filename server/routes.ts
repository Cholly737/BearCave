import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // API routes for teams
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeamById(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // API routes for fixtures
  app.get("/api/teams/:teamId/fixtures", async (req, res) => {
    try {
      const fixtures = await storage.getFixturesByTeamId(req.params.teamId);
      res.json(fixtures);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      res.status(500).json({ message: "Failed to fetch fixtures" });
    }
  });

  // API routes for feed items
  app.get("/api/feed", async (req, res) => {
    try {
      const feedItems = await storage.getAllFeedItems();
      res.json(feedItems);
    } catch (error) {
      console.error("Error fetching feed items:", error);
      res.status(500).json({ message: "Failed to fetch feed items" });
    }
  });

  app.get("/api/feed/latest", async (req, res) => {
    try {
      const feedItems = await storage.getAllFeedItems();
      if (feedItems.length === 0) {
        return res.status(404).json({ message: "No feed items found" });
      }
      // Sort by date descending and get the first one
      const latestItem = feedItems.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      res.json(latestItem);
    } catch (error) {
      console.error("Error fetching latest feed item:", error);
      res.status(500).json({ message: "Failed to fetch latest feed item" });
    }
  });

  // API routes for sponsors
  app.get("/api/sponsors", async (req, res) => {
    try {
      const sponsors = await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      res.status(500).json({ message: "Failed to fetch sponsors" });
    }
  });

  // PlayHQ API integration
  app.get("/api/playhq/fixtures/:gradeId", async (req, res) => {
    try {
      const gradeId = req.params.gradeId;
      const apiKey = "ab089110-cbe7-49b4-a03d-cb4ff829d19b"; // PlayHQ API key provided
      const tenantId = "ca"; // PlayHQ tenant ID provided
      
      console.log(`Fetching PlayHQ fixtures for grade ID: ${gradeId}`);
      
      // Call the PlayHQ 'fixture for grade V2' API
      const response = await axios.get(
        `https://api.playhq.com/v1/fixture/grade/${gradeId}`,
        {
          headers: {
            "x-api-key": apiKey,
            "x-phq-tenant": tenantId,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log(`PlayHQ API response received with status: ${response.status}`);
      
      // Transform the response to match our Fixture type
      // The mapping will be adjusted based on the actual API response structure
      const fixtures = Array.isArray(response.data.data) 
        ? response.data.data.map((item: any) => {
            // Extract date and time from PlayHQ timestamp format
            const fixtureDate = new Date(item.dateTime || Date.now());
            const dateStr = fixtureDate.toISOString().split('T')[0];
            
            // Extract venue information
            const location = item.venue ? 
              `${item.venue.name}${item.venue.address ? ', ' + item.venue.address : ''}` :
              'TBD';
              
            // Determine home and away teams
            const isTeam1Home = item.team1 && item.team1.homeTeam;
            const homeTeam = isTeam1Home ? item.team1 : item.team2;
            const awayTeam = isTeam1Home ? item.team2 : item.team1;
            
            // Extract scores if available
            const homeScore = item.scores && homeTeam ? item.scores[homeTeam.id] : undefined;
            const awayScore = item.scores && awayTeam ? item.scores[awayTeam.id] : undefined;
            
            // Determine status based on available data
            let status: "scheduled" | "in-progress" | "completed" | "postponed" | "cancelled" = "scheduled";
            if (item.status === "COMPLETE") {
              status = "completed";
            } else if (item.status === "IN_PROGRESS") {
              status = "in-progress";
            } else if (item.status === "POSTPONED") {
              status = "postponed";
            } else if (item.status === "CANCELLED") {
              status = "cancelled";
            }
            
            return {
              id: item.id || String(Math.random()),
              teamId: gradeId, // Using the grade ID as team ID for now
              date: dateStr,
              location: location,
              isHome: !!(homeTeam && homeTeam.id === gradeId), // Assume this team is the one requested
              opposingTeam: awayTeam ? awayTeam.name : "TBD",
              opposingTeamAbbreviation: awayTeam ? awayTeam.abbreviation : undefined,
              opposingTeamColor: awayTeam && awayTeam.colors && awayTeam.colors.length > 0 ? 
                awayTeam.colors[0] : undefined,
              result: {
                homeScore,
                awayScore,
                status
              }
            };
          })
        : [];
        
      console.log(`Processed ${fixtures.length} fixtures from PlayHQ`);
      res.json(fixtures);
    } catch (error) {
      console.error("Error fetching PlayHQ fixtures:", error);
      
      // Log more details about the error
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      
      // Fallback to stored fixtures if PlayHQ API fails
      try {
        console.log("Falling back to stored fixtures");
        const fixtures = await storage.getFixturesByTeamId(req.params.gradeId);
        res.json(fixtures);
      } catch (fallbackError) {
        console.error("Error fetching fallback fixtures:", fallbackError);
        res.status(500).json({ message: "Failed to fetch fixtures" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
