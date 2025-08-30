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
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load events. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : events && Array.isArray(events) && events.length > 0 ? (
          events.map((event: Event) => (
            <div key={event.id} className="bear-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-primary mb-1">{event.name}</h3>
                  <p className="text-xs text-gray-600">
                    Location
                  </p>
                  <p className="text-xs text-gray-600">
                    Date, Time
                  </p>
                </div>
                <i className="ri-arrow-right-line text-gray-400"></i>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <i className="ri-calendar-event-line text-4xl text-gray-400 mb-4 block"></i>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No events yet</h3>
              <p className="text-gray-500 text-sm">Check back later for upcoming club events</p>
            </div>
            
            {/* Hidden example event item - remove the 'hidden' class to show */}
            <div className="hidden bear-card max-w-md mx-auto">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-lg w-12 h-16 flex flex-col items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-xs font-medium">MAR</span>
                  <span className="text-lg font-bold">15</span>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-primary mb-1">Annual Club BBQ</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <i className="ri-map-pin-line mr-1"></i>
                    Deepdene Cricket Ground
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <i className="ri-time-line mr-1"></i>
                    6:00 PM - 9:00 PM
                  </p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
