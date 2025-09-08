import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Fixtures from "@/pages/Fixtures";
import FixtureDetail from "@/pages/FixtureDetail";
import Feed from "@/pages/Feed";
import Links from "@/pages/Links";
import ClubPolicy from "@/pages/ClubPolicy";
import Registrations from "@/pages/Registrations";
import Shop from "@/pages/Shop";
import Sponsors from "@/pages/Sponsors";
import NotFound from "@/pages/not-found";
import AuthOverlay from "@/components/AuthOverlay";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

function App() {
  // React hooks must be called in the same order on every render
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show auth overlay if not authenticated (after loading is complete)
  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      setShowAuthOverlay(true);
    }
  }, [isAuthenticated, loading]);

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
          <Route path="club-policy" element={<ClubPolicy />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="shop" element={<Shop />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      {showAuthOverlay && !loading && !isAuthenticated && (
        <AuthOverlay onAuthSuccess={handleAuthSuccess} />
      )}
      
      <PWAInstallPrompt />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
