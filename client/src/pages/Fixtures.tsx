import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchTeams } from "@/lib/api";
import { Team } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <div>
      <h2 className="text-xl font-heading font-bold px-4 py-3">Team Fixtures</h2>
      
      <div className="px-4 pb-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="border-b border-neutral-200 last:border-b-0 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 loading-skeleton rounded-full mr-3"></div>
                    <div>
                      <div className="loading-skeleton h-5 w-24 rounded mb-1"></div>
                      <div className="loading-skeleton h-3 w-16 rounded"></div>
                    </div>
                  </div>
                  <div className="loading-skeleton h-4 w-4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load teams. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : teams && teams.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul>
              {teams.map((team: Team) => (
                <li key={team.id} className="border-b border-neutral-200 last:border-b-0">
                  <Link to={`/fixtures/${team.id}`} className="block p-4 hover:bg-neutral-50 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {team.abbreviation || getTeamInitials(team.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <p className="text-xs text-neutral-600">{team.division}</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-s-line text-neutral-400"></i>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
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
