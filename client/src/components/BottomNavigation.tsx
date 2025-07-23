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
    <nav className="bear-nav-bottom">
      <div className="flex justify-around">
        <Link to="/" className={`flex flex-col items-center py-2 px-3 ${isActive("/") ? "text-accent" : "text-gray-600"}`}>
          <i className="ri-home-5-fill text-2xl"></i>
        </Link>
        <Link to="/fixtures" className={`flex flex-col items-center py-2 px-3 ${isActive("/fixtures") ? "text-accent" : "text-gray-600"}`}>
          <i className="ri-calendar-line text-2xl"></i>
        </Link>
        <Link to="/feed" className={`flex flex-col items-center py-2 px-3 ${isActive("/feed") ? "text-accent" : "text-gray-600"}`}>
          <i className="ri-baseball-line text-2xl"></i>
        </Link>
        <Link to="/events" className={`flex flex-col items-center py-2 px-3 ${isActive("/events") ? "text-accent" : "text-gray-600"}`}>
          <i className="ri-notification-3-line text-2xl"></i>
        </Link>
        <Link to="/links" className={`flex flex-col items-center py-2 px-3 ${isActive("/links") ? "text-accent" : "text-gray-600"}`}>
          <i className="ri-user-line text-2xl"></i>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
