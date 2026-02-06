import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Clock, MapPin, Ticket } from "lucide-react";
import sleepyBear from "@/assets/images/sleepy-bear.png";

const Events = () => {
  const { 
    data: events,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/events"],
    staleTime: 5 * 60 * 1000,
  });

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short', timeZone: 'Australia/Sydney' }).toUpperCase(),
      day: date.getDate()
    };
  };

  return (
    <PullToRefresh queryKeys={["/api/events"]}>
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Events</h1>
      </div>
      
      <div className="px-4 pb-4">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bear-card">
              <div className="flex items-start">
                <div className="w-12 h-16 loading-skeleton rounded mr-3 flex-shrink-0"></div>
                <div className="w-full">
                  <div className="loading-skeleton h-6 w-3/4 rounded mb-3"></div>
                  <div className="loading-skeleton h-4 rounded mb-2"></div>
                  <div className="loading-skeleton h-4 w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : events && Array.isArray(events) && events.length > 0 ? (
          events.map((event: Event) => {
            const { month, day } = formatEventDate(event.date);
            return (
              <Card key={event.id} className="mb-4 overflow-hidden bear-card">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-12 h-16 bg-primary text-white rounded mr-3 flex-shrink-0 flex flex-col items-center justify-center text-center">
                      <div className="text-xs font-medium">{month}</div>
                      <div className="text-lg font-bold">{day}</div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      {((event.name.toLowerCase().includes("president") && event.name.toLowerCase().includes("dinner")) || 
                        event.name.toLowerCase().includes("rodeo")) && (
                        <Link to="/shop" data-testid="link-buy-tickets">
                          <Button className="w-full sm:w-auto" size="sm">
                            <Ticket className="h-4 w-4 mr-2" />
                            Buy Tickets
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-16">
            <img src={sleepyBear} alt="Sleepy bear" className="w-32 h-32 mx-auto mb-4 opacity-80" />
            <p className="text-muted-foreground font-medium text-lg mb-2">No events yet</p>
            <p className="text-muted-foreground/70 text-sm max-w-sm mx-auto">
              We'll post upcoming club events, training sessions, and social gatherings here. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
    </PullToRefresh>
  );
};

export default Events;
