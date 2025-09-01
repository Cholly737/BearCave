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
        ) : (
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
