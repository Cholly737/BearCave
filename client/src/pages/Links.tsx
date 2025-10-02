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
            <div className="space-y-3">
              <a 
                href="/attached_assets/WISDENE%202020-2021%20-%20updated%2018-02-2022%20v2%20(Clean%20Version)%20(1)_1757030633052.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-neutral-50 transition-colors text-left w-full"
              >
                <i className="ri-file-pdf-line text-lg text-primary flex-shrink-0 mt-0.5"></i>
                <div className="flex-1">
                  <div className="font-medium">Wisdene 2020-2021</div>
                  <div className="text-xs text-neutral-600">Club documentation - Opens in new tab</div>
                </div>
                <i className="ri-external-link-line text-neutral-400"></i>
              </a>

              <a 
                href="https://northwestcricket.com/wp-content/uploads/2023/04/laws-of-cricket-2017-code-3rd-edition-2022_1.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-neutral-50 transition-colors text-left w-full"
                data-testid="link-cricket-laws"
              >
                <i className="ri-file-pdf-line text-lg text-primary flex-shrink-0 mt-0.5"></i>
                <div className="flex-1">
                  <div className="font-medium">Laws of Cricket</div>
                  <div className="text-xs text-neutral-600">2017 Code - 3rd Edition 2022 - Opens in new tab</div>
                </div>
                <i className="ri-external-link-line text-neutral-400"></i>
              </a>
            </div>
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
              
              <a 
                href="https://www.deepdenebearscc.com.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-neutral-50 transition-colors"
              >
                <i className="ri-home-line text-lg text-primary"></i>
                <div>
                  <div className="font-medium">Deepdene Website</div>
                  <div className="text-xs text-neutral-600">Official club website</div>
                </div>
                <i className="ri-external-link-line text-neutral-400 ml-auto"></i>
              </a>
              
              <a 
                href="https://easterncricket.au/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-neutral-50 transition-colors"
                data-testid="link-eastern-cricket"
              >
                <i className="ri-shield-line text-lg text-primary"></i>
                <div>
                  <div className="font-medium">Eastern Cricket</div>
                  <div className="text-xs text-neutral-600">Association website</div>
                </div>
                <i className="ri-external-link-line text-neutral-400 ml-auto"></i>
              </a>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default Links;