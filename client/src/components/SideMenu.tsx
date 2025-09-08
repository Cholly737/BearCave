import { FC } from "react";
import { Link } from "react-router-dom";
import { X, FileText, Users, ShoppingBag, Award, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/useNotifications";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { 
    permission, 
    token, 
    isSupported, 
    isLoading, 
    canRequestPermission, 
    requestPermission, 
    unsubscribe 
  } = useNotifications();
  
  const menuItems = [
    { to: "/club-policy", icon: FileText, label: "Club Policy" },
    { to: "/registrations", icon: Users, label: "Registrations" },
    { to: "/shop", icon: ShoppingBag, label: "Shop" },
    { to: "/sponsors", icon: Award, label: "Sponsors" },
  ];

  const handleNotificationToggle = async () => {
    if (permission === 'granted' && token) {
      await unsubscribe();
    } else if (canRequestPermission) {
      await requestPermission();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-primary">Menu</h2>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-primary"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon size={20} className="mr-3 text-primary" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Notification Settings */}
          {isSupported && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {permission === 'granted' && token ? (
                      <Bell size={20} className="mr-3 text-primary" />
                    ) : (
                      <BellOff size={20} className="mr-3 text-gray-400" />
                    )}
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Notifications</span>
                      {permission === 'denied' && (
                        <p className="text-xs text-gray-500">Blocked in browser</p>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={permission === 'granted' && !!token}
                    onCheckedChange={handleNotificationToggle}
                    disabled={isLoading || permission === 'denied'}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;