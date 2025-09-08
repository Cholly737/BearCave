import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Offline() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <WifiOff className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl">You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            It looks like you've lost your internet connection. 
            Some features may not be available until you're back online.
          </p>
          
          <div className="space-y-3 pt-2">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Install the BearCave app for better offline access</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}