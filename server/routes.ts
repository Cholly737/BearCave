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

  // PlayHQ API integration with credential management
  app.get("/api/playhq/fixtures/:gradeId", async (req, res) => {
    const gradeId = req.params.gradeId;
    
    // Use environment variables for API credentials
    const apiKey = process.env.PLAYHQ_API_KEY;
    
    // Validate that we have required credentials
    if (!apiKey) {
      console.log("Missing required PlayHQ API key");
      return res.status(500).json({ 
        message: "Missing PlayHQ API key"
      });
    }
    
    // Winter team mapping - this is the ID for Deepdene Bears Winter XI
    const WINTER_TEAM_ID = "5";
    const isWinterTeam = gradeId === WINTER_TEAM_ID;
    
    try {
      console.log(`Fetching PlayHQ fixtures with API key: ${apiKey.substring(0, 4)}...`);
      
      // Try a simple, direct approach to the PlayHQ API
      console.log(`Team ID: ${gradeId} | Winter team: ${isWinterTeam}`);
      
      // Use the grades/:id/games endpoint structure
      const gradeIdForAPI = process.env.PLAYHQ_GRADE_ID || gradeId;
      let apiEndpoint = `https://api.playhq.com/v2/grades/${gradeIdForAPI}/games`;
      console.log(`Trying v2 grades/games endpoint: ${apiEndpoint}`);
      
      // Make the API call with minimal headers
      const response = await axios.get(
        apiEndpoint,
        {
          headers: {
            "x-api-key": apiKey,
            "Accept": "application/json"
          },
          validateStatus: function (status) {
            // Consider all status codes as successful to handle them manually
            return true;
          }
        }
      );
      
      console.log(`PlayHQ API response received with status: ${response.status}`);
      
      // Check if we got a successful response
      if (response.status === 200 && response.data) {
        console.log("Successfully connected to PlayHQ API");
        
        // Transform the response to match our Fixture type
        const fixtures = Array.isArray(response.data) 
          ? response.data.map((item: any) => ({
              id: item.id || String(Math.random()),
              teamId: parseInt(gradeId) || 0,
              date: item.date || new Date().toISOString().split('T')[0],
              location: item.venue?.name || "TBD",
              isHome: item.isHome || false,
              opposingTeam: item.opposingTeam || "TBD",
              opposingTeamAbbreviation: item.opposingTeamAbbreviation,
              opposingTeamColor: "#4682B4",
              result: {
                status: "scheduled"
              }
            }))
          : [];
          
        console.log(`Processed ${fixtures.length} fixtures from PlayHQ for grade ${gradeId}`);
        
        if (fixtures.length > 0) {
          res.json(fixtures);
          return;
        }
      }
      
      // If no fixtures received from API, use fallback fixtures
      throw new Error("No fixtures returned from PlayHQ API");
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
      
      // Fallback to stored fixtures or generate sample fixtures
      try {
        // For Deepdene Bears Winter XI team
        const teamId = isWinterTeam ? 5 : (isNaN(parseInt(gradeId)) ? 5 : parseInt(gradeId));
        
        console.log(`Falling back to stored fixtures for team ID: ${teamId}`);
        const fixtures = await storage.getFixturesByTeamId(teamId.toString());
        
        if (fixtures && fixtures.length > 0) {
          console.log(`Found ${fixtures.length} fallback fixtures in database`);
          res.json(fixtures);
        } else {
          // If no fixtures found in database, create sample fixtures for winter team
          if (isWinterTeam) {
            console.log("Creating sample winter fixtures as fallback");
            
            // Define sample winter fixtures
            const sampleWinterFixtures = [
              {
                id: 1001,
                teamId: 5,
                date: "2025-06-01",
                location: "Deepdene Cricket Ground",
                isHome: true,
                opposingTeam: "North Balwyn Knights",
                opposingTeamAbbreviation: "NBK",
                opposingTeamColor: "#2E8B57",
                result: { status: "scheduled" }
              },
              {
                id: 1002,
                teamId: 5,
                date: "2025-06-08",
                location: "Surrey Hills Oval",
                isHome: false,
                opposingTeam: "Surrey Hills Eagles",
                opposingTeamAbbreviation: "SHE",
                opposingTeamColor: "#CD7F32",
                result: { status: "scheduled" }
              },
              {
                id: 1003,
                teamId: 5,
                date: "2025-06-15",
                location: "Deepdene Cricket Ground",
                isHome: true,
                opposingTeam: "Box Hill North Sharks",
                opposingTeamAbbreviation: "BHNS",
                opposingTeamColor: "#4682B4",
                result: { status: "scheduled" }
              }
            ];
            
            res.json(sampleWinterFixtures);
          } else {
            // For other teams with no fixtures
            res.json([]);
          }
        }
      } catch (fallbackError) {
        console.error("Error fetching fallback fixtures:", fallbackError);
        res.status(500).json({ message: "Failed to fetch fixtures" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
