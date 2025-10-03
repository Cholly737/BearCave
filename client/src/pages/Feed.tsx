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
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Process Instagram embeds when posts load
    if (instagramPosts && (window as any).instgrm) {
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary flex items-center">
            <i className="ri-instagram-line text-purple-600 mr-2"></i>
            Latest from Instagram
          </h2>
          <a
            href="https://www.instagram.com/deepdenebearscc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
            data-testid="link-view-all-instagram"
          >
            View All <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </div>

        {instagramLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-skeleton h-96 rounded-lg"></div>
            ))}
          </div>
        ) : instagramPosts && instagramPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instagramPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="instagram-embed"
                dangerouslySetInnerHTML={{
                  __html: `<blockquote class="instagram-media" data-instgrm-permalink="${post.postUrl}" data-instgrm-version="14" style="margin: 0;"></blockquote>`
                }}
              />
            ))}
          </div>
        ) : (
          <a
            href="https://www.instagram.com/deepdenebearscc/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all"
            data-testid="link-instagram-placeholder"
          >
            <div className="text-center">
              <i className="ri-instagram-fill text-6xl mb-4 block"></i>
              <h3 className="text-xl font-bold mb-2">@deepdenebearscc</h3>
              <p className="text-sm opacity-90">Tap to view our Instagram feed</p>
            </div>
          </a>
        )}
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
