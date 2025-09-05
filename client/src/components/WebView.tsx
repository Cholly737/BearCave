import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WebViewProps {
  url: string;
  title: string;
  onClose?: () => void;
}

const WebView = ({ url, title, onClose }: WebViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark"
            >
              <i className="ri-external-link-line text-lg"></i>
            </a>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <i className="ri-close-line"></i>
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-neutral-600 truncate">{url}</div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-96">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
              <div className="text-center">
                <div className="loading-spinner mb-2"></div>
                <p className="text-sm text-neutral-600">Loading website...</p>
              </div>
            </div>
          )}
          
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
              <div className="text-center">
                <i className="ri-error-warning-line text-4xl text-error mb-3"></i>
                <p className="text-error font-semibold mb-2">Unable to load website</p>
                <p className="text-sm text-neutral-600 mb-4">
                  This website doesn't allow embedding or has security restrictions.
                </p>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                >
                  Open in new tab
                  <i className="ri-external-link-line"></i>
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={url}
              className="w-full h-full border-0 rounded-b-lg"
              onLoad={handleLoad}
              onError={handleError}
              title={title}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebView;