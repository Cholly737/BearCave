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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className="ri-file-text-line text-2xl text-primary"></i>
                <div>
                  <h3 className="font-semibold">Wisdene 2020-2021</h3>
                  <p className="text-sm text-neutral-600">Club documentation</p>
                </div>
              </div>
              <Button size="sm">
                <i className="ri-download-line mr-1"></i>
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* External Websites */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <i className="ri-global-line text-primary"></i>
              Cricket Websites
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {externalLinks.map((link) => (
                <Button
                  key={link.title}
                  variant="outline"
                  className="justify-start p-4 h-auto"
                  onClick={() => handleOpenWebsite(link.url, link.title)}
                >
                  <div className="flex items-start gap-3 text-left">
                    <i className={`${link.icon} text-lg text-primary flex-shrink-0 mt-0.5`}></i>
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-xs text-neutral-600">{link.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Web Browser Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <i className="ri-window-line text-3xl text-primary mb-3"></i>
              <h3 className="font-semibold mb-2">Browse Within App</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Click any website link above to view it directly in the app without leaving. 
                Perfect for checking cricket scores, weather, or browsing PlayHQ!
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                <div className="flex items-center">
                  <i className="ri-shield-check-line mr-1"></i>
                  Secure
                </div>
                <div className="flex items-center">
                  <i className="ri-speed-line mr-1"></i>
                  Fast loading
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
