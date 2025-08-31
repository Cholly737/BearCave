import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WebView from "@/components/WebView";

const Links = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

  const handleOpenWebsite = (url: string, title: string) => {
    setCurrentUrl(url);
    setCurrentTitle(title);
    setShowWebView(true);
  };

  const externalLinks = [
    {
      title: "Cricket Australia",
      url: "https://www.cricket.com.au",
      description: "Official Cricket Australia website",
      icon: "ri-trophy-line"
    },
    {
      title: "PlayHQ",
      url: "https://playhq.com",
      description: "Fixture and competition management",
      icon: "ri-calendar-line"
    },
    {
      title: "ESPN Cricinfo",
      url: "https://www.espncricinfo.com",
      description: "Latest cricket news and scores",
      icon: "ri-newspaper-line"
    },
    {
      title: "Weather",
      url: "https://www.bom.gov.au",
      description: "Bureau of Meteorology weather forecasts",
      icon: "ri-cloud-line"
    }
  ];

  if (showWebView) {
    return (
      <div className="pb-20">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWebView(false)}
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Back to Links
            </Button>
            <h1 className="text-xl font-bold text-primary">{currentTitle}</h1>
          </div>
        </div>
        
        <div className="px-4">
          <WebView
            url={currentUrl}
            title={currentTitle}
            onClose={() => setShowWebView(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Links</h1>
      </div>
      
      <div className="px-4 space-y-4">
        {/* Contact Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <i className="ri-mail-line text-3xl text-primary mb-3"></i>
              <h3 className="font-semibold text-lg mb-1">Contact Us</h3>
              <p className="text-neutral-600 mb-3">deepdenebears@gmail.com</p>
              <a 
                href="mailto:deepdenebears@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
              >
                Send Email
                <i className="ri-external-link-line"></i>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <i className="ri-file-text-line text-primary"></i>
              Club Documents
            </h3>
            <Button
              variant="outline"
              className="w-full justify-start p-4 h-auto"
              onClick={() => handleOpenWebsite("https://docs.google.com/document/d/1example-wisdene-doc/preview", "Wisdene 2020-2021")}
            >
              <div className="flex items-start gap-3 text-left w-full">
                <i className="ri-file-pdf-line text-lg text-primary flex-shrink-0 mt-0.5"></i>
                <div className="flex-1">
                  <div className="font-medium">Wisdene 2020-2021</div>
                  <div className="text-xs text-neutral-600">Club documentation - View in app</div>
                </div>
                <i className="ri-eye-line text-neutral-400"></i>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* External Websites */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <i className="ri-global-line text-primary"></i>
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href="mailto:deepdenebears@gmail.com"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-neutral-50 transition-colors"
              >
                <i className="ri-mail-line text-lg text-primary"></i>
                <div>
                  <div className="font-medium">Send Email</div>
                  <div className="text-xs text-neutral-600">deepdenebears@gmail.com</div>
                </div>
                <i className="ri-external-link-line text-neutral-400 ml-auto"></i>
              </a>
              
              <a 
                href="https://www.cricket.com.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-neutral-50 transition-colors"
              >
                <i className="ri-trophy-line text-lg text-primary"></i>
                <div>
                  <div className="font-medium">Cricket Australia</div>
                  <div className="text-xs text-neutral-600">Official cricket website</div>
                </div>
                <i className="ri-external-link-line text-neutral-400 ml-auto"></i>
              </a>
              
              <a 
                href="https://playhq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-neutral-50 transition-colors"
              >
                <i className="ri-calendar-line text-lg text-primary"></i>
                <div>
                  <div className="font-medium">PlayHQ</div>
                  <div className="text-xs text-neutral-600">Fixture management</div>
                </div>
                <i className="ri-external-link-line text-neutral-400 ml-auto"></i>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Web Browser Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <i className="ri-window-line text-3xl text-primary mb-3"></i>
              <h3 className="font-semibold mb-2">View Documents in App</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Click the Wisdene document above to view it directly in the app without leaving. 
                Perfect for reading club documents while staying in the Bears app!
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                <div className="flex items-center">
                  <i className="ri-shield-check-line mr-1"></i>
                  Secure viewing
                </div>
                <div className="flex items-center">
                  <i className="ri-file-text-line mr-1"></i>
                  Document reader
                </div>
                <div className="flex items-center">
                  <i className="ri-arrow-left-right-line mr-1"></i>
                  Easy navigation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Links;
