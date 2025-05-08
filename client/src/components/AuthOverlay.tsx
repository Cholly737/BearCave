import { FC, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface AuthOverlayProps {
  onAuthSuccess: () => void;
}

const AuthOverlay: FC<AuthOverlayProps> = ({ onAuthSuccess }) => {
  const { signInWithGooglePopup, enableGuestMode, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const user = await signInWithGooglePopup();
      if (user) {
        onAuthSuccess();
      } else {
        setAuthError("Failed to authenticate. Please try again.");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setAuthError("An error occurred during sign in. Please try again.");
    }
  };

  // Enable guest mode and close the auth overlay
  const handleGuestAccess = () => {
    enableGuestMode();
    onAuthSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-secondary mx-auto bg-primary flex items-center justify-center">
            <i className="ri-cricket-fill text-secondary text-3xl"></i>
          </div>
          <h2 className="text-xl font-heading font-bold mt-4">Welcome to Deepdene Bears</h2>
          <p className="text-sm text-neutral-600 mt-2">Sign in to access club information</p>
        </div>
        
        {authError && (
          <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-md text-sm">
            {authError}
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          <Button 
            onClick={handleSignIn}
            disabled={loading}
            variant="outline"
            className="flex items-center justify-center px-4 py-3 bg-white w-full hover:bg-neutral-50 transition"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="ri-loader-2-line animate-spin mr-2"></i> Signing in...
              </span>
            ) : (
              <>
                <i className="ri-google-fill text-xl mr-3"></i>
                <span className="font-semibold">Sign in with Google</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={handleGuestAccess}
            variant="default"
            className="w-full"
          >
            Continue as Guest
          </Button>
        </div>
        
        <p className="text-xs text-neutral-500 text-center">
          By continuing, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
