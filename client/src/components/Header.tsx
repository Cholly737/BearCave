import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-primary text-white py-3 px-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <Link to="/" className="flex items-center">
        <div className="w-10 h-10 rounded-full border-2 border-secondary bg-white flex items-center justify-center overflow-hidden">
          <i className="ri-cricket-fill text-primary text-xl"></i>
        </div>
        <h1 className="ml-2 text-xl font-heading font-bold">Deepdene Bears</h1>
      </Link>
      <button onClick={onMenuClick} className="text-2xl">
        <i className="ri-menu-line"></i>
      </button>
    </header>
  );
};

export default Header;
