import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header onMenuClick={toggleSideMenu} />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
