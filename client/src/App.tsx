import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Feed from "@/pages/Feed";
import Links from "@/pages/Links";
import ClubPolicy from "@/pages/ClubPolicy";
import Registrations from "@/pages/Registrations";
import Shop from "@/pages/Shop";
import Sponsors from "@/pages/Sponsors";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="feed" element={<Feed />} />
          <Route path="links" element={<Links />} />
          <Route path="club-policy" element={<ClubPolicy />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="shop" element={<Shop />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
