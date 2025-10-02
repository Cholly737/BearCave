import { useQuery } from "@tanstack/react-query";
import { fetchFeedItems } from "@/lib/api";
import { FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const Feed = () => {
  const { 
    data: feedItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/feed"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  // Helper to format date
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

  // Helper to get icon based on feed type
  const getIconForFeedType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'notification':
        return <i className="ri-notification-3-line"></i>;
      case 'achievement':
        return <i className="ri-trophy-line"></i>;
      case 'fixture':
        return <i className="ri-calendar-event-line"></i>;
      case 'merchandise':
        return <i className="ri-shopping-bag-line"></i>;
      default:
        return <i className="ri-information-line"></i>;
    }
  };

  // Helper to get background color based on feed type
  const getBgColorForFeedType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'notification':
        return 'bg-accent';
      case 'achievement':
        return 'bg-success';
      case 'fixture':
        return 'bg-blue-500';
      case 'merchandise':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Feed</h1>
      </div>

      {/* Instagram Feed Section */}
      <div className="px-4 pb-4">
        <div className="bear-card-enhanced mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <i className="ri-instagram-line text-purple-600 mr-2 text-xl"></i>
              Latest from Instagram
            </h3>
            <a 
              href="https://www.instagram.com/deepdenebearscc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 text-sm hover:text-purple-700 transition-colors font-medium flex items-center"
              data-testid="link-instagram"
            >
              View All <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </div>
          
          {/* Instagram Feed Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href="https://www.instagram.com/deepdenebearscc/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity"
                data-testid={`instagram-post-${i}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center opacity-50 group-hover:opacity-70 transition-opacity">
                    <i className="ri-instagram-line text-purple-400 text-3xl mb-2 block"></i>
                    <p className="text-xs text-gray-600">View Post</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            ))}
          </div>

          {/* Follow Button */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-instagram-fill text-white text-2xl"></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">@deepdenebearscc</p>
                  <p className="text-sm text-gray-600">Follow for latest photos & updates</p>
                </div>
              </div>
              <a 
                href="https://www.instagram.com/deepdenebearscc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                data-testid="button-follow-instagram"
              >
                <i className="ri-instagram-line"></i>
                Follow
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start mb-3">
                  <div className="rounded-full loading-skeleton w-10 h-10 flex-shrink-0 mr-3"></div>
                  <div className="w-full">
                    <div className="loading-skeleton h-5 w-48 rounded mb-1"></div>
                    <div className="loading-skeleton h-3 w-24 rounded"></div>
                  </div>
                </div>
                <div className="loading-skeleton h-4 rounded mb-2"></div>
                <div className="loading-skeleton h-4 rounded mb-2"></div>
                <div className="loading-skeleton h-4 w-3/4 rounded mb-4"></div>
                
                <div className="mt-3 flex">
                  <div className="loading-skeleton h-6 w-16 rounded-full mr-2"></div>
                  <div className="loading-skeleton h-6 w-16 rounded-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load feed items. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : feedItems && Array.isArray(feedItems) && feedItems.length > 0 ? (
          feedItems.map((item: FeedItem) => (
            <div key={item.id} className="bear-card">
              <h3 className="font-medium text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.content}</p>
              <p className="text-xs text-gray-500">{getTimeAgo(item.date)}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <i className="ri-file-list-3-line text-4xl text-gray-400 mb-4 block"></i>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No feed updates yet</h3>
              <p className="text-gray-500 text-sm">Check back later for club news and announcements</p>
            </div>
            
            {/* Hidden example feed item - remove the 'hidden' class to show */}
            <div className="hidden bear-card max-w-md mx-auto">
              <div className="flex items-start mb-3">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="ri-notification-3-line text-sm"></i>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-primary mb-1">Training Update</h3>
                  <p className="text-sm text-gray-600 mb-2">Training has been moved from Stradbroke Park South Oval due to weather conditions. New location is the indoor nets at Canterbury Sports Complex.</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
