import { FC } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AuthOverlayProps {
  onAuthSuccess: () => void;
}

const AuthOverlay: FC<AuthOverlayProps> = ({ onAuthSuccess }) => {
  const { signInWithGooglePopup, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      onAuthSuccess();
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-secondary mx-auto bg-primary flex items-center justify-center">
            <i className="ri-cricket-fill text-secondary text-3xl"></i>
          </div>
          <h2 className="text-xl font-heading font-bold mt-4">Welcome to Deepdene Bears</h2>
          <p className="text-sm text-neutral-600 mt-2">Please sign in to continue</p>
        </div>
        
        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="flex items-center justify-center px-4 py-3 bg-white border border-neutral-300 rounded-lg w-full mb-4 hover:bg-neutral-50 transition disabled:opacity-50"
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
        </button>
        
        <p className="text-xs text-neutral-500 text-center">
          By signing in, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthOverlay;
