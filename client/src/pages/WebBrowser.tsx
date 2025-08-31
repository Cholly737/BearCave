import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WebView from "@/components/WebView";

const WebBrowser = () => {
  const [url, setUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [showWebView, setShowWebView] = useState(false);

  // Quick links for common cricket-related sites
  const quickLinks = [
    { name: "Cricket Australia", url: "https://www.cricket.com.au" },
    { name: "ESPN Cricinfo", url: "https://www.espncricinfo.com" },
    { name: "PlayHQ", url: "https://playhq.com" },
    { name: "Weather", url: "https://www.bom.gov.au" },
    { name: "Google Maps", url: "https://maps.google.com" },
  ];

  const handleNavigate = (targetUrl: string) => {
    // Ensure URL has protocol
    let formattedUrl = targetUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    setCurrentUrl(formattedUrl);
    setShowWebView(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      handleNavigate(url);
    }
  };

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Web Browser</h1>
      </div>
      
      <div className="px-4">
        {!showWebView ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigate to Website</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-2">
                      Enter website URL
                    </label>
                    <Input
                      id="url"
                      type="text"
                      placeholder="e.g. cricket.com.au or https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <i className="ri-global-line mr-2"></i>
                    Go to Website
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      onClick={() => handleNavigate(link.url)}
                      className="justify-start"
                    >
                      <i className="ri-link mr-2"></i>
                      {link.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <i className="ri-information-line text-4xl text-primary mb-3"></i>
                  <h3 className="font-semibold mb-2">Browse Without Leaving</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    View websites directly within the app. Some sites may require opening in a new tab due to security restrictions.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                    <div className="flex items-center">
                      <i className="ri-shield-check-line mr-1"></i>
                      Secure browsing
                    </div>
                    <div className="flex items-center">
                      <i className="ri-external-link-line mr-1"></i>
                      External link option
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWebView(false)}
              >
                <i className="ri-arrow-left-line mr-1"></i>
                Back
              </Button>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate(url)}
                className="flex-1"
                placeholder="Enter new URL..."
              />
              <Button
                size="sm"
                onClick={() => handleNavigate(url)}
              >
                <i className="ri-refresh-line"></i>
              </Button>
            </div>
            
            <WebView
              url={currentUrl}
              title="Web Browser"
              onClose={() => setShowWebView(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebBrowser;