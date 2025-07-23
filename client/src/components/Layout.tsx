import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="main-content">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
