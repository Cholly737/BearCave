import { Card, CardContent } from "@/components/ui/card";

const ClubPolicy = () => {
  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Policy</h2>
      
      <div className="px-4 pb-20">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Legislation</h3>
            <div className="space-y-3 text-sm">
              <p>The Deepdene Bears Cricket Club are proud to adhere to Cricket Victoria, Cricket Australia and Victorian Government legislation.</p>
              <ul className="list-disc list-inside space-y-2 text-neutral-700">
               
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Child Safe & Member Protection</h3>
            <div className="space-y-3 text-sm">
               <p>Deepdene Bears Endorse Cricket Victoria's Child Safe & Member Protection Policy.</p>
              <div className="mt-3">
                <a href="https://www.cricketvictoria.com.au/child-safe-member-protection/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
                  <i className="ri-external-link-line text-lg mr-2"></i>
                  Cricket Victoria Child Safe & Member Protection Policy
                </a>
              </div>
            </div>
          </CardContent>
        </Card>


    

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>For questions about club policies, contact:</p>
              <div className="flex items-center">
                <i className="ri-mail-line text-lg text-primary mr-3"></i>
                <a href="mailto:deepdenebears@gmail.com" className="text-primary hover:underline">
                  deepdenebears@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubPolicy;