import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { sendTestNotification } from "./firebase-admin";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve dynamically configured service worker
  app.get("/sw.js", (req, res) => {
    try {
      const swPath = path.join(import.meta.dirname, "..", "client", "public", "sw.js");
      let swContent = fs.readFileSync(swPath, "utf-8");
      
      // Replace Firebase config placeholders with actual environment variables
      const firebaseConfig = {
        apiKey: process.env.VITE_FIREBASE_API_KEY || "",
        authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
        storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
        appId: process.env.VITE_FIREBASE_APP_ID || ""
      };
      
      // Replace the hardcoded config in service worker
      const configPattern = /const firebaseConfig = \{[\s\S]*?\};/;
      const newConfig = `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;
      swContent = swContent.replace(configPattern, newConfig);
      
      res.setHeader("Content-Type", "application/javascript");
      res.setHeader("Service-Worker-Allowed", "/");
      res.send(swContent);
    } catch (error) {
      console.error("Error serving service worker:", error);
      res.status(500).send("// Service worker error");
    }
  });
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

  // API routes for Instagram posts
  app.get("/api/instagram-posts", async (req, res) => {
    try {
      const posts = await storage.getActiveInstagramPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      res.status(500).json({ message: "Failed to fetch Instagram posts" });
    }
  });

  // Notification subscription routes
  app.post("/api/notifications/subscribe", async (req, res) => {
    try {
      const { token, userId } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "FCM token is required" });
      }
      
      const subscription = await storage.subscribeToNotifications({
        fcmToken: token,
        userId: userId || null,
        isActive: true
      });
      
      res.json({ message: "Successfully subscribed to notifications", subscription });
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      res.status(500).json({ message: "Failed to subscribe to notifications" });
    }
  });

  app.post("/api/notifications/unsubscribe", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "FCM token is required" });
      }
      
      const success = await storage.unsubscribeFromNotifications(token);
      
      if (success) {
        res.json({ message: "Successfully unsubscribed from notifications" });
      } else {
        res.status(404).json({ message: "Subscription not found" });
      }
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error);
      res.status(500).json({ message: "Failed to unsubscribe from notifications" });
    }
  });

  // Admin endpoint to get all active subscriptions (for sending notifications)
  app.get("/api/notifications/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getAllActiveSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Test endpoint to send notification to all subscribers
  app.post("/api/notifications/test", async (req, res) => {
    try {
      // Get all active subscriptions
      const subscriptions = await storage.getAllActiveSubscriptions();
      
      if (subscriptions.length === 0) {
        return res.json({ 
          message: "No active subscriptions found. Enable notifications in your browser first!",
          success: false 
        });
      }

      const tokens = subscriptions.map(sub => sub.fcmToken);
      
      // Send test notification
      const result = await sendTestNotification(
        tokens,
        "🎉 Deepdene Bears Test",
        "Push notifications are working! You'll receive club updates here."
      );

      res.json({
        message: "Test notification sent successfully!",
        success: true,
        subscriberCount: subscriptions.length,
        successCount: result.successCount,
        failureCount: result.failureCount
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      res.status(500).json({ 
        message: "Failed to send test notification",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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
      
      // Make the API call with required headers from PlayHQ documentation
      const tenantId = process.env.PLAYHQ_TENANT_ID || 'ca';
      const response = await axios.get(
        apiEndpoint,
        {
          headers: {
            "x-api-key": apiKey,
            "x-phq-tenant": tenantId,
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
      
      let errorDetails = "Unknown error occurred";
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const statusText = error.response?.statusText;
        
        console.error("Axios error details:", {
          status,
          statusText,
          data: error.response?.data
        });
        
        // Provide specific error messages based on HTTP status
        switch (status) {
          case 401:
            errorDetails = "Invalid API credentials";
            break;
          case 403:
            errorDetails = "Access denied - API permissions insufficient";
            break;
          case 404:
            errorDetails = "PlayHQ endpoint not found";
            break;
          case 429:
            errorDetails = "Rate limit exceeded - too many requests";
            break;
          case 500:
            errorDetails = "PlayHQ server error";
            break;
          case 503:
            errorDetails = "PlayHQ service temporarily unavailable";
            break;
          default:
            errorDetails = `PlayHQ API error: ${status} ${statusText}`;
        }
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
