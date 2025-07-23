import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUpcomingEvents, fetchLatestFeedItem } from "@/lib/api";
import { Event, FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import logoImg from "@assets/logo_1753257070954.jpg";


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

  // Helper to format date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

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
      {/* BearCave Header */}
      <div className="bear-header">
        Welcome to the BearCave
      </div>
      
      {/* Hero Section with Logo and Social */}
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="mb-4">
            <div className="w-24 h-24 mx-auto mb-2 bg-white rounded-full flex items-center justify-center border-2 border-primary overflow-hidden">
              <img src={logoImg} alt="Deepdene Bears Cricket Club" className="w-20 h-20 object-contain" />
            </div>
         
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bear-card">
          <h3 className="font-semibold mb-3">Socials</h3>
          <div className="flex justify-around">
            <a href="https://www.instagram.com/deepdenebearscc/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <i className="ri-instagram-fill text-white text-xl"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-facebook-fill text-white text-xl"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="ri-youtube-fill text-white text-xl"></i>
            </a>
            <a href="#" className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DB</span>
            </a>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bear-card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Upcoming Events</h3>
            <i className="ri-arrow-right-line text-gray-400"></i>
          </div>
          
          {eventsLoading ? (
            <>
              <div className="border border-gray-200 rounded-lg p-3 mb-3 loading-skeleton h-20"></div>
              <div className="border border-gray-200 rounded-lg p-3 mb-3 loading-skeleton h-20"></div>
            </>
          ) : eventsError ? (
            <p className="text-sm text-gray-500">Unable to load upcoming events</p>
          ) : events && events.length > 0 ? (
            <>
              {events.slice(0, 2).map((event: Event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-3 mb-3 last:mb-0 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-primary">{event.name}</h4>
                      <p className="text-xs text-gray-600">
                        {formatEventDate(event.date).day}th {formatEventDate(event.date).month}
                      </p>
                      <p className="text-xs text-gray-600">{event.location}</p>
                    </div>
                    <i className="ri-arrow-right-line text-gray-400"></i>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-primary">Grand Final Weekend</h4>
                  <p className="text-xs text-gray-600">1st & 10th March</p>
                  <p className="text-xs text-gray-600">Strathmore Park</p>
                </div>
                <i className="ri-arrow-right-line text-gray-400"></i>
              </div>
            </div>
          )}
        </div>

        {/* Latest in Feed */}
        <div className="px-4">
          <div className="bear-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Latest in feed</h3>
              <i className="ri-arrow-right-line text-gray-400"></i>
            </div>
            
            {feedLoading ? (
              <div className="border border-gray-200 rounded-lg p-3 loading-skeleton h-20"></div>
            ) : feedError ? (
              <p className="text-sm text-gray-500">Unable to load latest feed</p>
            ) : latestFeedItem ? (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-primary mb-1">{latestFeedItem.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{latestFeedItem.content}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(latestFeedItem.date)}</p>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400 ml-2"></i>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-primary mb-1">Training for Thursday</h4>
                    <p className="text-xs text-gray-600 mb-2">Training has been moved from Stradbroke Park South Oval due to weather conditions</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <i className="ri-arrow-right-line text-gray-400 ml-2"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
