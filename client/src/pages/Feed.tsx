import { useQuery } from "@tanstack/react-query";
import { fetchFeedItems } from "@/lib/api";
import { FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import WebView from "@/components/WebView";

const Feed = () => {
  const { 
    data: feedItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/feed"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
      <div className="px-4 pb-20">
        <div className="h-[calc(100vh-120px)]">
          <WebView
            url="https://www.instagram.com/deepdenebearscc/"
            title="Deepdene Bears Instagram page"
            onClose={() => {}}
          />
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
