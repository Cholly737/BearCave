import { useQuery } from "@tanstack/react-query";
import { fetchFeedItems } from "@/lib/api";
import { FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

interface InstagramPost {
  id: number;
  postUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const Feed = () => {
  const { 
    data: feedItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/feed"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: instagramPosts,
    isLoading: instagramLoading
  } = useQuery<InstagramPost[]>({
    queryKey: ["/api/instagram-posts"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [instagramPosts]);

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
          
          {/* Instagram Feed - First Post */}
          {instagramLoading ? (
            <div className="loading-skeleton h-96 rounded-lg mb-4"></div>
          ) : instagramPosts && instagramPosts.length > 0 && instagramPosts[0] ? (
            <div 
              className="instagram-embed-container mb-4"
              dangerouslySetInnerHTML={{
                __html: `<blockquote class="instagram-media" data-instgrm-permalink="${instagramPosts[0].postUrl}" data-instgrm-version="14"></blockquote>`
              }}
            />
          ) : (
            <a
              href="https://www.instagram.com/deepdenebearscc/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-12 text-center hover:opacity-90 transition-opacity mb-4"
              data-testid="instagram-placeholder"
            >
              <i className="ri-instagram-line text-purple-400 text-6xl mb-4 block"></i>
              <p className="text-lg font-semibold text-gray-800 mb-2">Latest from Instagram</p>
              <p className="text-sm text-gray-600">Click to view our Instagram feed</p>
            </a>
          )}

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
        ) : null}
      </div>
    </div>
  );
};

export default Feed;
