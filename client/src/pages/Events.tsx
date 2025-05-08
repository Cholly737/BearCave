import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const addToCalendar = (event: Event) => {
    // Implementation of calendar integration would go here
    alert(`Added "${event.name}" to your calendar`);
  };

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Upcoming Events</h2>
      
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
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load events. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : events && events.length > 0 ? (
          events.map((event: Event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="bg-primary text-white text-center rounded p-2 mr-3 w-12 flex-shrink-0">
                    <div className="text-xs">{formatEventDate(event.date).month}</div>
                    <div className="text-xl font-bold">{formatEventDate(event.date).day}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-neutral-700 mt-2">{event.description}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm text-neutral-600">
                        <i className="ri-time-line mr-2"></i>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-600">
                        <i className="ri-map-pin-line mr-2"></i>
                        <span>{event.location}</span>
                      </div>
                      {event.audience && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <i className="ri-user-line mr-2"></i>
                          <span>{event.audience}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => addToCalendar(event)} 
                      className="mt-4 bg-primary text-white"
                    >
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-600">No upcoming events scheduled at this time. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Events;
