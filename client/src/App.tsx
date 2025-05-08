import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Fixtures from "@/pages/Fixtures";
import FixtureDetail from "@/pages/FixtureDetail";
import Feed from "@/pages/Feed";
import Links from "@/pages/Links";
import NotFound from "@/pages/not-found";
import AuthOverlay from "@/components/AuthOverlay";
import "./lib/firebase"; // Initialize Firebase

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      
      // If the user is not authenticated, show the auth overlay
      if (!user && isAuthenticated === null) {
        setShowAuthOverlay(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Effects for handling navigation and URL changes
  useEffect(() => {
    // If user navigates to specific pages that need auth and isn't authenticated,
    // show auth overlay
    if (isAuthenticated === false) {
      setShowAuthOverlay(true);
    }
  }, [isAuthenticated, location.pathname]);

  const handleAuthSuccess = () => {
    setShowAuthOverlay(false);
  };

  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="fixtures" element={<Fixtures />} />
          <Route path="fixtures/:teamId" element={<FixtureDetail />} />
          <Route path="feed" element={<Feed />} />
          <Route path="links" element={<Links />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      {showAuthOverlay && isAuthenticated === false && (
        <AuthOverlay onAuthSuccess={handleAuthSuccess} />
      )}
      
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
