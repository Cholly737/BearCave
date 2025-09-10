import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

const Events = () => {
  const { 
    data: events,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/events"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper to format date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short', timeZone: 'Australia/Sydney' }).toUpperCase(),
      day: date.getDate()
    };
  };


  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Events</h1>
      </div>
      
      <div className="px-4 pb-4">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="w-12 h-16 loading-skeleton rounded mr-3 flex-shrink-0"></div>
                  <div className="w-full">
                    <div className="loading-skeleton h-6 w-3/4 rounded mb-3"></div>
                    <div className="loading-skeleton h-4 rounded mb-2"></div>
                    <div className="loading-skeleton h-4 rounded mb-2"></div>
                    <div className="loading-skeleton h-4 w-1/2 rounded mb-4"></div>
                    <div className="loading-skeleton h-10 w-1/3 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : events && Array.isArray(events) && events.length > 0 ? (
          // Events found - display them
          events.map((event: Event) => {
            const { month, day } = formatEventDate(event.date);
            return (
              <Card key={event.id} className="mb-4 overflow-hidden bear-card">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    {/* Date Badge */}
                    <div className="w-12 h-16 bg-primary text-white rounded mr-3 flex-shrink-0 flex flex-col items-center justify-center text-center">
                      <div className="text-xs font-medium">{month}</div>
                      <div className="text-lg font-bold">{day}</div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{event.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      
                      {/* Event Info */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-time-line w-4 mr-2"></i>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-map-pin-line w-4 mr-2"></i>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="ri-group-line w-4 mr-2"></i>
                          <span>{event.audience}</span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          // No events found - show empty state
          <div className="text-center py-12">
            <i className="ri-calendar-line text-6xl text-neutral-300 mb-4"></i>
            <p className="text-neutral-500 font-medium text-lg mb-2">No events yet</p>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto">
              We'll post upcoming club events, training sessions, and social gatherings here. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
