import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Registrations = () => {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Team Registrations</h2>
      
      <div className="px-4 pb-20">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">2024-25 Season Registration</h3>
            <div className="space-y-3 text-sm">
              <p>Join the Deepdene Bears for another exciting season of cricket!</p>
              <div className="bg-accent text-white p-3 rounded-md">
                <p className="font-semibold">Registration Now Open</p>
                <p className="text-xs mt-1">Early bird pricing available until February 28th</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Registration Fees</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Senior Player (18+)</p>
                  <p className="text-xs text-neutral-600">Full season membership</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$350</p>
                  <p className="text-xs text-neutral-600">Early bird: $300</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Junior Player (U18)</p>
                  <p className="text-xs text-neutral-600">Full season membership</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$200</p>
                  <p className="text-xs text-neutral-600">Early bird: $150</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">Social Member</p>
                  <p className="text-xs text-neutral-600">Non-playing membership</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">$50</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">What's Included</h3>
            <div className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
                <li>Match fees for all home and away games</li>
                <li>Training facility access twice weekly</li>
                <li>Club uniform (cap, playing shirt)</li>
                <li>End of season presentation dinner</li>
                <li>Access to club social events</li>
                <li>Cricket equipment maintenance and storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Registration Process</h3>
            <div className="space-y-3 text-sm">
              <ol className="list-decimal list-inside space-y-2 text-neutral-700">
                <li>Complete online registration form</li>
                <li>Submit payment via bank transfer or card</li>
                <li>Attend mandatory preseason meeting</li>
                <li>Complete fitness and skills assessment</li>
                <li>Receive team allocation and training schedule</li>
              </ol>
              
              <div className="mt-4">
                <Button className="w-full">
                  <i className="ri-external-link-line mr-2"></i>
                  Complete Registration Online
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Important Dates</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Early bird deadline</span>
                <span className="font-semibold">Feb 28, 2025</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Registration closes</span>
                <span className="font-semibold">Mar 15, 2025</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Preseason training starts</span>
                <span className="font-semibold">Mar 20, 2025</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Season commences</span>
                <span className="font-semibold">Apr 5, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Questions?</h3>
            <div className="space-y-2 text-sm">
              <p>Contact our registration coordinator:</p>
              <div className="flex items-center">
                <i className="ri-mail-line text-lg text-primary mr-3"></i>
                <a href="mailto:registrations@deepdenebears.com" className="text-primary hover:underline">
                  registrations@deepdenebears.com
                </a>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line text-lg text-primary mr-3"></i>
                <a href="tel:+61398765432" className="text-primary hover:underline">
                  +61 3 9876 5432
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registrations;