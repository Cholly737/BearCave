import { useQuery } from "@tanstack/react-query";
import { fetchSponsors } from "@/lib/api";
import { type Sponsor } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

const Sponsors = () => {
  const { 
    data: sponsors,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/sponsors"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Our Sponsors</h1>
      </div>
      
      <div className="px-4">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2 text-primary">Thank You to Our Supporters</h3>
              <p className="text-sm text-neutral-600">
                The Deepdene Bears Cricket Club is proud to be supported by these wonderful local businesses and organizations. 
                Their partnership helps us maintain our facilities, support our teams, and grow cricket in our community.
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="loading-skeleton h-32"></div>
                <CardContent className="pt-4">
                  <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
                  <div className="loading-skeleton h-3 w-full mb-1"></div>
                  <div className="loading-skeleton h-3 w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <i className="ri-error-warning-line text-error text-4xl mb-3"></i>
                <p className="text-error font-semibold">Failed to load sponsors</p>
                <p className="text-sm text-neutral-600 mt-1">Please try again later or contact support.</p>
              </div>
            </CardContent>
          </Card>
        ) : sponsors && sponsors.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.map((sponsor: Sponsor) => (
                <Card key={sponsor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-white p-6 flex items-center justify-center h-32">
                    <img 
                      src={sponsor.logoUrl} 
                      alt={`${sponsor.name} logo`} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-2">{sponsor.name}</h3>
                    <p className="text-sm text-neutral-600 mb-3">{sponsor.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-neutral-500">
                        <i className="ri-award-line mr-1"></i>
                        <span>{sponsor.sponsorshipLevel}</span>
                      </div>
                      
                      {sponsor.website && (
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark flex items-center text-sm font-medium"
                        >
                          Visit Website
                          <i className="ri-external-link-line ml-1"></i>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <i className="ri-building-line text-neutral-400 text-4xl mb-3"></i>
                <p className="text-neutral-600">No sponsors available at this time.</p>
                <p className="text-sm text-neutral-500 mt-1">We're always looking for new partnerships!</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">Become a Sponsor</h3>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Join our family of supporters and help us continue to provide quality cricket experiences 
                for players of all ages in our community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <i className="ri-trophy-line text-2xl text-primary mb-2"></i>
                  <h4 className="font-semibold text-sm mb-1">Gold Sponsors</h4>
                  <p className="text-xs text-neutral-600">Benefits</p>
                </div>
                
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <i className="ri-medal-line text-2xl text-primary mb-2"></i>
                  <h4 className="font-semibold text-sm mb-1">Sponsorship 2</h4>
                  <p className="text-xs text-neutral-600">Benefits</p>
                </div>
                
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <i className="ri-award-line text-2xl text-primary mb-2"></i>
                  <h4 className="font-semibold text-sm mb-1">Sponsorship 3</h4>
                  <p className="text-xs text-neutral-600">Benefits</p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ready to partner with us?</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <div className="flex items-center">
                      <i className="ri-mail-line text-lg text-primary mr-2"></i>
                      <a href="mailto:sponsorship@deepdenebears.com" className="text-primary hover:underline text-sm">
                        sponsorship@deepdenebears.com
                      </a>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-phone-line text-lg text-primary mr-2"></i>
                      <a href="tel:+61398765432" className="text-primary hover:underline text-sm">
                        +61 3 9876 5432
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sponsors;