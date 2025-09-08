import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img 
            src="/attached_assets/logo_1753257070954.jpg" 
            alt="Deepdene Bears Logo" 
            className="w-10 h-10 object-contain rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Install Bears Cricket</h3>
          <p className="text-xs text-gray-600 mb-3">
            Add to your home screen for quick access to fixtures, events, and club news
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="bg-primary text-white"
            >
              Install
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;