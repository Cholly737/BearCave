import { FC } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@assets/logo_1753257070954.jpg";

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

const Header: FC<HeaderProps> = ({ onMenuClick, isMenuOpen }) => {
  return (
    <header className="bear-header-nav">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
            <img src={logoImg} alt="Deepdene Bears Cricket Club" className="w-8 h-8 object-contain" />
          </div>
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