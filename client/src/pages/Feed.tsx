import { useQuery } from "@tanstack/react-query";
import { FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Bell, Trophy, CalendarDays, ShoppingBag, Info, AlertTriangle } from "lucide-react";
import sleepyBear from "@/assets/images/sleepy-bear.png";

const Feed = () => {
  const { 
    data: feedItems,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/feed"],
    staleTime: 5 * 60 * 1000,
  });

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

  const getIconForFeedType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'notification': return <Bell className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'fixture': return <CalendarDays className="h-4 w-4" />;
      case 'merchandise': return <ShoppingBag className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <PullToRefresh queryKeys={["/api/feed"]}>
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Feed</h1>
      </div>

      <div className="px-4 pb-4">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bear-card">
              <div className="flex items-start mb-3">
                <div className="rounded-full loading-skeleton w-10 h-10 flex-shrink-0 mr-3"></div>
                <div className="w-full">
                  <div className="loading-skeleton h-5 w-48 rounded mb-1"></div>
                  <div className="loading-skeleton h-3 w-24 rounded"></div>
                </div>
              </div>
              <div className="loading-skeleton h-4 rounded mb-2"></div>
              <div className="loading-skeleton h-4 w-3/4 rounded"></div>
            </div>
          ))
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-500">Failed to load feed items. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : feedItems && Array.isArray(feedItems) && feedItems.length > 0 ? (
          feedItems.map((item: FeedItem) => (
            <div key={item.id} className="bear-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getIconForFeedType(item.type || 'notification')}
                </div>
                <span className="text-xs text-muted-foreground">{getTimeAgo(item.date)}</span>
              </div>
              <h3 className="font-medium text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <img src={sleepyBear} alt="Sleepy bear" className="w-32 h-32 mx-auto mb-4 opacity-80" />
            <p className="text-muted-foreground font-medium mb-2">No updates yet</p>
            <p className="text-muted-foreground/70 text-sm max-w-xs mx-auto">
              Check back later for club news, match reports, and announcements
            </p>
          </div>
        )}
      </div>
    </div>
    </PullToRefresh>
  );
};

export default Feed;
