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
  
  // Group teams by division
  const getTeamsByDivision = (teams: Team[] | undefined) => {
    if (!teams) return {};
    
    return teams.reduce((grouped: Record<string, Team[]>, team) => {
      const division = team.division || 'Other';
      if (!grouped[division]) {
        grouped[division] = [];
      }
      grouped[division].push(team);
      return grouped;
    }, {});
  };
  
  const teamsByDivision = getTeamsByDivision(teams as Team[]);
  const divisions = teams ? Object.keys(teamsByDivision) : [];

  return (
    <div>
      <div className="px-4 py-3 bg-primary text-white">
        <h2 className="text-xl font-heading font-bold">Deepdene Bears Teams</h2>
        <p className="text-sm opacity-90 mt-1">View fixtures by selecting a team</p>
      </div>
      
      <div className="px-4 py-4">
        {isLoading ? (
          // Loading state with skeleton loaders
          <div className="space-y-6">
            {Array(3).fill(0).map((_, divIndex) => (
              <div key={divIndex}>
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
            ))}
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
        ) : teams && teams.length > 0 ? (
          // Teams grouped by division
          <div className="space-y-6">
            {divisions.map((division) => (
              <div key={division} className="team-division">
                <h3 className="text-lg font-heading font-semibold mb-3 border-b pb-1">{division}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamsByDivision[division].map((team: Team) => (
                    <Link key={team.id} to={`/fixtures/${team.id}`}>
                      <Card className="hover:shadow-lg transition duration-200 h-full">
                        <CardContent className="pt-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4 text-xl">
                              {team.abbreviation || getTeamInitials(team.name)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{team.name}</h3>
                              <p className="text-sm text-neutral-600 mt-1">{team.division}</p>
                              <div className="mt-3">
                                <Badge variant="outline" className="bg-primary/10">
                                  View Fixtures
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-600">No teams found. Check back soon for updates.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Fixtures;
