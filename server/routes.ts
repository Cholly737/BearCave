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
    const tenantId = process.env.PLAYHQ_TENANT_ID;
    const orgId = process.env.PLAYHQ_ORG_ID;
    const seasonId = process.env.PLAYHQ_SEASON_ID;
    
    // Validate that we have all required credentials
    if (!apiKey || !tenantId) {
      console.log("Missing required PlayHQ API credentials");
      return res.status(500).json({ 
        message: "Missing PlayHQ API credentials",
        missingCredentials: {
          apiKey: !apiKey,
          tenantId: !tenantId
        }
      });
    }
    
    // Winter team mapping - this is the ID for Deepdene Bears Winter XI
    const WINTER_TEAM_ID = "5";
    const isWinterTeam = gradeId === WINTER_TEAM_ID;
    
    try {
      console.log(`Fetching PlayHQ fixtures with API key: ${apiKey.substring(0, 4)}...`);
      console.log(`Using tenant ID: ${tenantId}`);
      
      // Determine the correct API endpoint to use
      let apiEndpoint;
      
      // Try using the v2 API endpoint format 
      console.log(`Team ID: ${gradeId} | Winter team: ${isWinterTeam}`);
      
      // For winter team, try different PlayHQ API endpoints
      if (isWinterTeam) {
        // Try different API formats that might work with this API key
        
        // First try a simple direct endpoint to see if the API key works at all
        apiEndpoint = `https://api.playhq.com/v1/health`;
        console.log(`Checking API health endpoint: ${apiEndpoint}`);
        
        // Alternative endpoints we could try:
        // apiEndpoint = `https://api.playhq.com/v1/tenant/competitions`;
        // apiEndpoint = `https://api.playhq.com/v1/competitions/grades`;
        // apiEndpoint = `https://api.playhq.com/v1/tenants/ca/competitions`;
        
        // If we need to use grade ID later:
        // const playHQGradeId = process.env.PLAYHQ_GRADE_ID || "72b43d55-b46f-432d-ae4c-82d1871d1bcd";
      } else if (orgId && seasonId) {
        // For other teams with org and season IDs
        apiEndpoint = `https://api.playhq.com/v2/organisations/${orgId}/seasons/${seasonId}/fixtures`;
        console.log(`Using v2 organisations seasons endpoint: ${apiEndpoint}`);
      } else {
        // Fallback to direct v2 endpoint for the provided ID
        apiEndpoint = `https://api.playhq.com/v2/grades/${gradeId}/games`;
        console.log(`Using v2 grades/games endpoint: ${apiEndpoint}`);
      }
      
      console.log(`Making PlayHQ API request to: ${apiEndpoint}`);
      
      // Show the headers we're using
      console.log(`Using x-api-key: ${apiKey.substring(0, 4)}...`);
      console.log(`Using x-phq-tenant: ${tenantId}`);
      
      // Add more debug information to API call
      const response = await axios.get(
        apiEndpoint,
        {
          headers: {
            "x-api-key": apiKey,
            "x-phq-tenant": tenantId,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          validateStatus: function (status) {
            // Consider all status codes as successful to handle them manually
            return true;
          }
        }
      );
      
      console.log(`PlayHQ API response received with status: ${response.status}`);
      
      // Transform the response to match our Fixture type
      const fixtures = Array.isArray(response.data.data) 
        ? response.data.data.map((item: any) => {
            // Extract date and time from PlayHQ timestamp format
            const fixtureDate = new Date(item.dateTime || Date.now());
            const dateStr = fixtureDate.toISOString().split('T')[0];
            
            // Format time for display
            const timeStr = fixtureDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
            
            // Extract venue information
            const location = item.venue ? 
              `${item.venue.name}${item.venue.address ? ', ' + item.venue.address : ''}` :
              'TBD';
              
            // Determine home and away teams
            const isTeam1Home = item.team1 && item.team1.homeTeam;
            const homeTeam = isTeam1Home ? item.team1 : item.team2;
            const awayTeam = isTeam1Home ? item.team2 : item.team1;
            
            // For the winter team specifically, find Deepdene Bears team
            let isHome = false;
            let opposingTeam = "TBD";
            let opposingTeamAbbreviation = undefined;
            
            if (isWinterTeam) {
              // Look for Deepdene Bears in both teams
              const deepdeneTeam = [item.team1, item.team2].find(team => 
                team && (team.name?.includes("Deepdene") || team.name?.includes("Bears"))
              );
              
              const otherTeam = deepdeneTeam === item.team1 ? item.team2 : item.team1;
              
              if (deepdeneTeam) {
                isHome = deepdeneTeam.homeTeam === true;
                opposingTeam = otherTeam?.name || "TBD";
                opposingTeamAbbreviation = otherTeam?.abbreviation;
              } else {
                // If can't find Deepdene, fall back to regular logic
                isHome = !!(homeTeam && homeTeam.id === gradeId);
                opposingTeam = awayTeam?.name || "TBD";
                opposingTeamAbbreviation = awayTeam?.abbreviation;
              }
            } else {
              // For other teams, use standard logic
              isHome = !!(homeTeam && homeTeam.id === gradeId);
              opposingTeam = isHome ? (awayTeam?.name || "TBD") : (homeTeam?.name || "TBD");
              opposingTeamAbbreviation = isHome ? awayTeam?.abbreviation : homeTeam?.abbreviation;
            }
            
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
              teamId: parseInt(gradeId) || 0, // Convert to number for our DB schema
              date: dateStr,
              time: timeStr, // Add time for better display
              location: location,
              isHome: isHome,
              opposingTeam: opposingTeam,
              opposingTeamAbbreviation: opposingTeamAbbreviation,
              opposingTeamColor: "#4682B4", // Default blue for Mid Year Cricket Association
              result: {
                homeScore,
                awayScore,
                status
              }
            };
          })
        : [];
        
      console.log(`Processed ${fixtures.length} fixtures from PlayHQ for grade ${gradeId}`);
      
      // Check if we received fixtures from the API
      if (fixtures.length > 0) {
        res.json(fixtures);
      } else {
        // If no fixtures received from API, use fallback fixtures
        throw new Error("No fixtures returned from PlayHQ API");
      }
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
