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
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
    if (permission === 'granted' && token) {
      setVisible(false);
    }
  }, [isSupported, permission, token]);

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
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-lg animate-in slide-in-from-top-2 duration-300 border border-green-200">
      {/* Header */}
      <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Stay in the loop!</p>
            <p className="text-green-100 text-xs">Match results &amp; club announcements</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-green-200 transition-colors ml-2"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>

      {/* Action */}
      <div className="bg-white px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-gray-600 text-xs flex-1">
          Get notified about fixtures, events and important announcements from the Bears.
        </p>
        <button
          onClick={requestPermission}
          disabled={isLoading}
          className="flex-shrink-0 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Setting up…' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
