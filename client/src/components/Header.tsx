import { FC } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

const Header: FC<HeaderProps> = ({ onMenuClick, isMenuOpen }) => {
  return (
    <header className="bear-header-nav">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-white font-bold text-lg">BearCave</h1>
        </div>
        
        <button 
          onClick={onMenuClick}
          className="text-white hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;