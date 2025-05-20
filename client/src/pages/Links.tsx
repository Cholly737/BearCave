import { useQuery } from "@tanstack/react-query";
import { fetchSponsors } from "@/lib/api";
import { Sponsor } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const Links = () => {
  const { 
    data: sponsors,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/sponsors"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Links</h2>
      
      {/* Contact Info */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="ri-mail-line text-lg text-primary mr-3"></i>
                <a href="mailto:deepdenebears@gmail.com" className="text-primary hover:underline">          deepdenebears@gmail.com</a>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line text-lg text-primary mr-3"></i>
                <a href="tel:+61398765432" className="text-primary hover:underline">+61 3 9876 5432</a>
              </div>
              <div className="flex items-center">
                <i className="ri-map-pin-line text-lg text-primary mr-3"></i>
                <span>Deepdene Cricket Ground, Melbourne VIC 3103</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Important Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="ri-file-pdf-line text-lg text-primary mr-3"></i>
                <a href="https://drive.google.com/drive/home" className="text-primary hover:underline">Wisdene PDF</a>
              </div>
              <div className="flex items-center">
                <i className="ri-file-list-3-line text-lg text-primary mr-3"></i>
                <a href="#club-policy" className="text-primary hover:underline">Club Policy Document</a>
              </div>
              <div className="flex items-center">
                <i className="ri-calendar-line text-lg text-primary mr-3"></i>
                <a href="#club-calendar" className="text-primary hover:underline">2023-24 Club Calendar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sponsors List */}
      <div className="px-4 pb-4">
        <h3 className="font-semibold mb-3">Our Sponsors</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                <div className="w-full h-20 loading-skeleton rounded mb-2"></div>
                <div className="loading-skeleton h-4 w-3/4 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load sponsors. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : sponsors && sponsors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {sponsors.map((sponsor: Sponsor) => (
              <div key={sponsor.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="block">
                  <img 
                    src={sponsor.logoUrl} 
                    alt={`${sponsor.name} - Sponsor`} 
                    className="w-full h-20 object-contain mb-2" 
                  />
                  <h4 className="text-center font-semibold text-sm">{sponsor.name}</h4>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-600">No sponsors available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Social Media Links */}
      <div className="px-4 pb-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex justify-around">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-3xl text-blue-600">
                <i className="ri-facebook-circle-fill"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-3xl text-pink-600">
                <i className="ri-instagram-fill"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-3xl text-blue-400">
                <i className="ri-twitter-fill"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-3xl text-red-600">
                <i className="ri-youtube-fill"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;
