import { useQuery } from "@tanstack/react-query";
import { fetchFeedItems } from "@/lib/api";
import { FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

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
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Club Updates</h2>
      
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
        ) : feedItems && feedItems.length > 0 ? (
          feedItems.map((item: FeedItem) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start mb-3">
                  <div className={`rounded-full ${getBgColorForFeedType(item.type)} text-white w-10 h-10 flex items-center justify-center flex-shrink-0 mr-3`}>
                    {getIconForFeedType(item.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">Posted {getTimeAgo(item.date)}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700">{item.content}</p>
                
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-md mt-3 mb-3" 
                  />
                )}
                
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-neutral-200 text-neutral-700 rounded-full px-3 py-1 mr-2 mb-2 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-600">No updates available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Feed;
