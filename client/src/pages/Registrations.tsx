import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Registrations = () => {
  const registrationUrl = "https://www.playhq.com/cricket-australia/org/deepdene-bears-cricket-club/7e3945ee/register";

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Team Registrations</h2>
      
      <div className="px-4 pb-20">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mb-6">
              <i className="ri-external-link-line text-6xl text-primary mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Register with Deepdene Bears</h3>
              <p className="text-neutral-600 mb-6">
                Complete your registration through our official PlayHQ registration portal
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full max-w-md"
              onClick={() => window.open(registrationUrl, '_blank')}
            >
              <i className="ri-user-add-line mr-2"></i>
              Open Registration Portal
            </Button>
            
            <p className="text-xs text-neutral-500 mt-4">
              This will open PlayHQ in a new browser tab for secure registration
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registrations;