import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to determine if a nav item is active
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
      <div className="flex justify-around">
        <Link to="/" className={`flex flex-col items-center py-2 px-3 ${isActive("/") ? "text-primary" : "text-neutral-600"}`}>
          <i className="ri-home-5-line text-xl"></i>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/fixtures" className={`flex flex-col items-center py-2 px-3 ${isActive("/fixtures") ? "text-primary" : "text-neutral-600"}`}>
          <i className="ri-calendar-line text-xl"></i>
          <span className="text-xs mt-1">Fixtures</span>
        </Link>
        <Link to="/feed" className={`flex flex-col items-center py-2 px-3 ${isActive("/feed") ? "text-primary" : "text-neutral-600"}`}>
          <i className="ri-notification-3-line text-xl"></i>
          <span className="text-xs mt-1">Feed</span>
        </Link>
        <Link to="/events" className={`flex flex-col items-center py-2 px-3 ${isActive("/events") ? "text-primary" : "text-neutral-600"}`}>
          <i className="ri-calendar-event-line text-xl"></i>
          <span className="text-xs mt-1">Events</span>
        </Link>
        <Link to="/links" className={`flex flex-col items-center py-2 px-3 ${isActive("/links") ? "text-primary" : "text-neutral-600"}`}>
          <i className="ri-links-line text-xl"></i>
          <span className="text-xs mt-1">Links</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
