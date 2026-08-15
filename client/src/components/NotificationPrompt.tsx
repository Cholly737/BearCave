import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const PROMPT_DISMISSED_KEY = 'bearcave_notification_prompt_dismissed';

export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const { isSupported, permission, token, requestPermission, isLoading } = useNotifications();

  useEffect(() => {
    const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY);
    if (!dismissed && isSupported && permission === 'default') {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    if (permission === 'granted' && token) {
      setVisible(false);
    }
  }, [isSupported, permission, token]);

  const handleEnable = async () => {
    await requestPermission();
  };

  useEffect(() => {
    if (permission === 'granted' && token) {
      localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
      setVisible(false);
    }
  }, [permission, token]);

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-gradient-to-r from-primary to-slate-700 px-6 py-5 text-white text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
          <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-bold">Stay in the loop!</h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4 leading-relaxed">
            Get notified about match results, club events and important announcements from the Bears.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleEnable}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Setting up...' : 'Enable Notifications'}
            </button>
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
