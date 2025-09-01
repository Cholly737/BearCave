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
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to BearCave</h1>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bear-card">
          <h3 className="font-semibold mb-3">Socials</h3>
          <div className="flex justify-around">
            <a href="https://www.instagram.com/deepdenebearscc/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <i className="ri-instagram-fill text-white text-xl"></i>
            </a>
            <a href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fdeepdenebearscricketclub%2F" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-facebook-fill text-white text-xl"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCXo2UiPtMpRb0VXVVQyr4fg" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="ri-youtube-fill text-white text-xl"></i>
            </a>
            <a href="https://www.deepdenebears.com.au/" className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DB</span>
            </a>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bear-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Upcoming Events</h3>
            <Link to="/events" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          
          {eventsLoading ? (
            <div className="space-y-2">
              <div className="h-12 bg-neutral-100 rounded animate-pulse"></div>
              <div className="h-12 bg-neutral-100 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="text-center py-6">
              <i className="ri-calendar-line text-4xl text-neutral-300 mb-3"></i>
              <p className="text-neutral-500 font-medium">No events yet</p>
              <p className="text-neutral-400 text-sm">Check back later for upcoming club events</p>
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
            ) : latestFeedItem && typeof latestFeedItem === 'object' && 'title' in latestFeedItem ? (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-primary mb-1">{(latestFeedItem as FeedItem).title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{(latestFeedItem as FeedItem).content}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo((latestFeedItem as FeedItem).date)}</p>
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
