import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTeams } from "@/lib/api";
import { Team } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Fixtures = () => {
  const { 
    data: teams,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/teams"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper to generate team initials for the avatar
  const getTeamInitials = (teamName: string) => {
    const words = teamName.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.map(word => word[0]).join('').toUpperCase();
  };
  
  // Type guard to ensure teams is an array
  const teamsArray = Array.isArray(teams) ? teams : [];

  return (
    <div className="pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Fixtures</h1>
      </div>
      
      <div className="px-4 py-4">
        {isLoading ? (
          // Loading state with skeleton loaders
          <div className="space-y-6">
            <div className="loading-skeleton h-8 w-64 rounded mb-3"></div>
            <div className="loading-skeleton h-40 w-full rounded mb-6"></div>
            
            <div className="loading-skeleton h-6 w-32 rounded mb-3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(2).fill(0).map((_, teamIndex) => (
                <div key={teamIndex} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 loading-skeleton rounded-full mr-3"></div>
                    <div>
                      <div className="loading-skeleton h-5 w-32 rounded mb-1"></div>
                      <div className="loading-skeleton h-3 w-24 rounded"></div>
                    </div>
                  </div>
                  <div className="loading-skeleton h-4 w-20 rounded mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          // Error state
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load teams. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : teamsArray.length > 0 ? (
          <div className="space-y-4">
            {/* Team Cards */}
            {teamsArray.map((team: Team) => (
              <Link key={team.id} to={`/fixtures/${team.id}`}>
                <div className="bear-card">
                  <div className="text-center">
                    <h3 className="font-medium text-lg mb-1">{team.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{team.division}</p>
                    <button className="bear-button text-sm">
                      See Fixtures
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Empty state
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <i className="ri-calendar-line text-4xl text-neutral-400 mb-4"></i>
                <h3 className="font-semibold text-lg mb-2">No fixtures available</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  There are currently no teams or fixtures scheduled. Check back soon for updates!
                </p>
                <div className="text-xs text-neutral-500">
                  Fixtures will appear here once teams are added to the system
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Fixtures;
