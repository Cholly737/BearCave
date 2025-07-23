import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUpcomingEvents, fetchLatestFeedItem } from "@/lib/api";
import { Event, FeedItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";


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
    <div id="home-page">
      {/* Hero Banner */}
      <div className="relative">
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=400&q=80')" }}>
          <div className="absolute inset-0 bg-primary bg-opacity-60"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-2xl font-heading font-bold">Welcome to Deepdene Bears</h2>
   
        </div>
      </div>
      {/* Made by Charlotte 'Cholly' Molloy */}
      {/* Latest Notification */}
      {feedLoading ? (
        <div className="bg-white p-3 mx-4 my-4 rounded-md shadow-md loading-skeleton h-24"></div>
      ) : feedError ? (
        <div className="bg-error text-white p-3 mx-4 my-4 rounded-md shadow-md">
          <p className="text-sm">Unable to load latest notifications</p>
        </div>
      ) : latestFeedItem ? (
        <div className="bg-accent text-white p-3 mx-4 my-4 rounded-md shadow-md">
          <div className="flex items-start">
            <div className="text-xl mt-0.5 mr-2">
              <i className="ri-notification-3-line"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm">{latestFeedItem.title}</h3>
              <p className="text-xs mt-1">{latestFeedItem.content}</p>
              <p className="text-xs mt-2">Posted {getTimeAgo(latestFeedItem.date)}</p>
            </div>
          </div>
        </div>
      ) : null}
 
      {/* Upcoming Events */}
      <section className="px-4 py-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-heading font-semibold">Upcoming Events</h2>
          <Link to="/events" className="text-primary text-sm font-semibold">View All</Link>
        </div>
        
        {eventsLoading ? (
          <>
            <div className="bg-white rounded-lg shadow-md mb-3 overflow-hidden loading-skeleton h-32"></div>
            <div className="bg-white rounded-lg shadow-md mb-3 overflow-hidden loading-skeleton h-32"></div>
          </>
        ) : eventsError ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-error">Unable to load upcoming events</p>
            </CardContent>
          </Card>
        ) : events && events.length > 0 ? (
          <>
            {events.slice(0, 2).map((event: Event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md mb-3 overflow-hidden">
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="bg-primary text-white text-center rounded p-2 mr-3 w-12">
                      <div className="text-xs">{formatEventDate(event.date).month}</div>
                      <div className="text-xl font-bold">{formatEventDate(event.date).day}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-xs text-neutral-600 mt-1">{event.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 mb-2">{event.description}</p>
                  <div className="flex items-center text-xs text-neutral-600">
                    <i className="ri-map-pin-line mr-1"></i>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-neutral-600">No upcoming events scheduled</p>
            </CardContent>
          </Card>
        )}
      </section>
      
      
      
      {/* Social Media Feed */}
      <section className="px-4 py-3">
        <h2 className="text-lg font-heading font-semibold mb-3">Recent in Feed</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
              <i className="ri-facebook-fill"></i>
            </div>
           
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1508344928928-7165b0c396cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
            alt="Cricket equipment ready for training" 
            className="w-full h-64 object-cover rounded-md mb-3" 
          />
          
          <div className="flex justify-between text-sm text-neutral-600">
            <div className="flex items-center">
              <i className="ri-heart-line mr-1"></i>
              <span>23</span>
            </div>
            <div className="flex items-center">
              <i className="ri-chat-1-line mr-1"></i>
              <span>8</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
