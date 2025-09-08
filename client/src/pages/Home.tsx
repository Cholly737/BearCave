import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUpcomingEvents, fetchLatestFeedItem } from "@/lib/api";
import { Event, FeedItem } from "@/types";

const Home = () => {
  // Fetch upcoming events
  const { 
    data: events,
    isLoading: eventsLoading,
    error: eventsError 
  } = useQuery({
    queryKey: ["/api/events"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch latest feed item
  const { 
    data: latestFeedItem,
    isLoading: feedLoading,
    error: feedError 
  } = useQuery({
    queryKey: ["/api/feed/latest"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper to calculate time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div id="home-page" className="pb-20">
      {/* Enhanced Hero Header Section */}
      <div className="relative bg-gradient-to-br from-primary via-slate-700 to-slate-800 text-white py-12 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-lg mx-auto">
          {/* Club Logo */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-2 border-2 border-white/30">
              <img 
                src="/attached_assets/logo_1753257070954.jpg" 
                alt="Deepdene Bears Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          
          {/* Welcome Message */}
          <h1 className="text-3xl font-bold mb-3 leading-tight">🚨 CACHE BYPASS TEST 🚨</h1>
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            Home of the Deepdene Bears Cricket Club
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">5</div>
              <div className="text-sm text-white/80">Teams</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">2025</div>
              <div className="text-sm text-white/80">Season</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Enhanced Social Media Section */}
        <div className="bear-card-enhanced">
          <h3 className="font-semibold mb-4 text-lg text-gray-800">Connect With Us</h3>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://www.instagram.com/deepdenebearscc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link group bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <i className="ri-instagram-fill text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"></i>
              <div className="text-sm font-medium">Instagram</div>
              <div className="text-xs opacity-80">@deepdenebearscc</div>
            </a>
            
            <a 
              href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fdeepdenebearscricketclub%2F" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link group bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            >
              <i className="ri-facebook-fill text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"></i>
              <div className="text-sm font-medium">Facebook</div>
              <div className="text-xs opacity-80">Club Page</div>
            </a>
            
            <a 
              href="https://www.youtube.com/channel/UCXo2UiPtMpRb0VXVVQyr4fg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link group bg-gradient-to-r from-red-600 to-red-700 text-white"
            >
              <i className="ri-youtube-fill text-2xl mb-2 group-hover:scale-110 transition-transform duration-200"></i>
              <div className="text-sm font-medium">YouTube</div>
              <div className="text-xs opacity-80">Match Highlights</div>
            </a>
            
            <a 
              href="https://www.deepdenebears.com.au/" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link group bg-gradient-to-r from-primary to-slate-800 text-white"
            >
              <img 
                src="/attached_assets/logo_1753257070954.jpg" 
                alt="Deepdene Bears Logo" 
                className="w-8 h-8 object-contain rounded-full mb-2 group-hover:scale-110 transition-transform duration-200"
              />
              <div className="text-sm font-medium">Official Site</div>
              <div className="text-xs opacity-80">Bears Home</div>
            </a>
          </div>
        </div>

        {/* Enhanced Upcoming Events */}
        <div className="bear-card-enhanced">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <i className="ri-calendar-event-line text-primary mr-2"></i>
              Upcoming Events
            </h3>
            <Link to="/events" className="text-primary text-sm hover:text-slate-700 transition-colors font-medium">
              View All →
            </Link>
          </div>
          
          {eventsLoading ? (
            <div className="space-y-3">
              <div className="loading-skeleton h-16 rounded-lg"></div>
              <div className="loading-skeleton h-16 rounded-lg"></div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                <i className="ri-calendar-line text-3xl text-primary"></i>
              </div>
              <p className="text-gray-600 font-medium mb-2">No events scheduled</p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Check back later for upcoming club events, training sessions, and social gatherings
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Latest Feed */}
        <div className="bear-card-enhanced">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <i className="ri-newspaper-line text-primary mr-2"></i>
              Latest Updates
            </h3>
            <Link to="/feed" className="text-primary hover:text-slate-700 transition-colors">
              <i className="ri-arrow-right-line text-lg"></i>
            </Link>
          </div>
          
          {feedLoading ? (
            <div className="loading-skeleton h-20 rounded-lg"></div>
          ) : feedError ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-wifi-off-line text-gray-400 text-xl"></i>
              </div>
              <p className="text-gray-500 text-sm">Unable to load latest updates</p>
            </div>
          ) : latestFeedItem && typeof latestFeedItem === 'object' && 'title' in latestFeedItem ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-primary mb-2">{(latestFeedItem as FeedItem).title}</h4>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">{(latestFeedItem as FeedItem).content}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="ri-time-line mr-1"></i>
                    {getTimeAgo((latestFeedItem as FeedItem).date)}
                  </div>
                </div>
                <i className="ri-arrow-right-line text-primary ml-3 text-lg"></i>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
                <i className="ri-document-line text-3xl text-primary"></i>
              </div>
              <p className="text-gray-600 font-medium mb-2">No updates yet</p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Check back later for club news, match reports, and announcements
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
