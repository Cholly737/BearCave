import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setVisible(false);
      const timer = setTimeout(() => {
        prevPath.current = location.pathname;
        setVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header onMenuClick={toggleSideMenu} isMenuOpen={isSideMenuOpen} />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      
      <main className="main-content">
        <div
          className={`transition-all duration-200 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          }`}
        >
          <Outlet />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
