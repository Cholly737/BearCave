import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out z-50 shadow-xl ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-blue-800">
        <div className="flex justify-between items-center">
          <span className="text-xl font-heading font-bold">Menu</span>
          <button onClick={onClose} className="text-2xl">
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {isAuthenticated ? (
          <div className="mb-6 pt-2 pb-4 border-b border-blue-800">
            <div className="flex items-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="User Profile" 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center">
                  <i className="ri-user-line text-xl"></i>
                </div>
              )}
              <div className="ml-3">
                <p className="font-semibold text-white">{user?.displayName || "User"}</p>
                <p className="text-xs text-neutral-300">{user?.email || ""}</p>
              </div>
            </div>
            <button 
              onClick={signOut} 
              className="mt-4 px-4 py-2 text-sm border border-neutral-300 rounded-lg w-full text-center hover:bg-blue-800 transition"
            >
              Sign Out
            </button>
          </div>
        ) : null}
        
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/club-policy" className="block py-2 px-3 rounded hover:bg-blue-800 transition" onClick={onClose}>
                <i className="ri-file-list-3-line mr-2"></i> Club Policy
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/registrations" className="block py-2 px-3 rounded hover:bg-blue-800 transition" onClick={onClose}>
                <i className="ri-user-add-line mr-2"></i> Registrations
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/shop" className="block py-2 px-3 rounded hover:bg-blue-800 transition" onClick={onClose}>
                <i className="ri-shopping-bag-line mr-2"></i> Shop
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/sponsors" className="block py-2 px-3 rounded hover:bg-blue-800 transition" onClick={onClose}>
                <i className="ri-award-line mr-2"></i> Sponsors
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideMenu;
