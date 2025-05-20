import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeamFixtures, fetchTeamDetails, fetchPlayHQFixtures } from "@/lib/api";
import { Fixture } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const FixtureDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<'local' | 'playhq'>('local');
  
  // Define the PlayHQ grade ID for winter team
  const WINTER_TEAM_ID = 5; // Database ID for the Deepdene Bears Winter XI
  const PLAYHQ_GRADE_ID = "8f6d8877"; // The specific grade ID for PlayHQ integration
  
  // Determine which ID to use for PlayHQ API calls
  const getPlayHQGradeId = () => {
    // Use the specific grade ID for the winter team
    if (teamId === WINTER_TEAM_ID.toString()) {
      return PLAYHQ_GRADE_ID;
    }
    // For other teams, use their ID as is
    return teamId;
  };
  
  const playHQGradeId = getPlayHQGradeId();

  // Fetch team details
  const { 
    data: team,
    isLoading: teamLoading,
    error: teamError
  } = useQuery({
    queryKey: [`/api/teams/${teamId}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch team fixtures (local)
  const { 
    data: localFixtures,
    isLoading: localFixturesLoading,
    error: localFixturesError
  } = useQuery({
    queryKey: [`/api/teams/${teamId}/fixtures`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch PlayHQ fixtures using the grade ID
  const { 
    data: playhqFixtures,
    isLoading: playhqFixturesLoading,
    error: playhqFixturesError,
    refetch: refetchPlayHQFixtures
  } = useQuery({
    queryKey: [`/api/playhq/fixtures/${playHQGradeId}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: dataSource === 'playhq', // Only fetch when this data source is selected
  });
  
  // Auto-switch to PlayHQ data for winter team
  useEffect(() => {
    if (teamId === WINTER_TEAM_ID.toString() && dataSource === 'local') {
      setDataSource('playhq');
    }
  }, [teamId]);
  
  // Determine which fixtures to display based on the selected data source
  const fixtures = dataSource === 'playhq' ? playhqFixtures : localFixtures;
  const fixturesLoading = dataSource === 'playhq' ? playhqFixturesLoading : localFixturesLoading;
  const fixturesError = dataSource === 'playhq' ? playhqFixturesError : localFixturesError;

  const isLoading = teamLoading || fixturesLoading;
  const hasError = teamError || fixturesError;
  
  // Toggle between data sources
  const toggleDataSource = () => {
    const newSource = dataSource === 'local' ? 'playhq' : 'local';
    setDataSource(newSource);
    if (newSource === 'playhq') {
      refetchPlayHQFixtures();
    }
  };

  // Helper to format date
  const formatFixtureDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const handleGoBack = () => {
    navigate('/fixtures');
  };

  // Helper to get team initials
  const getTeamInitials = (teamName: string) => {
    return teamName.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      <div className="flex items-center px-4 py-3">
        <button className="text-lg mr-2" onClick={handleGoBack}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <h2 className="text-xl font-heading font-bold">
          {teamLoading ? 'Loading...' : team ? `${team.name} Fixtures` : 'Team Fixtures'}
        </h2>
        <div className="ml-auto">
          <Button 
            size="sm"
            variant={dataSource === 'playhq' ? 'default' : 'outline'}
            onClick={toggleDataSource}
            className="text-xs"
          >
            {dataSource === 'playhq' ? 'Using PlayHQ' : 'Using Local Data'}
          </Button>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-4 border-b border-neutral-200 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-16 h-16 loading-skeleton rounded"></div>
                  <div className="loading-skeleton h-4 w-24 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 loading-skeleton rounded-full mr-3"></div>
                    <div className="loading-skeleton h-5 w-32 rounded"></div>
                  </div>
                  <div className="loading-skeleton h-4 w-4 rounded mx-4"></div>
                  <div className="flex items-center">
                    <div className="loading-skeleton h-5 w-32 rounded"></div>
                    <div className="w-12 h-12 loading-skeleton rounded-full ml-3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex mb-4 gap-2">
                <i className="ri-error-warning-line text-error text-xl"></i>
                <p className="text-error">Failed to load fixtures. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        ) : fixtures && fixtures.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {fixtures.map((fixture: Fixture) => (
              <div key={fixture.id} className="p-4 border-b border-neutral-200 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-primary text-white text-center rounded p-2 w-16">
                    <div className="text-xs">{formatFixtureDate(fixture.date).month}</div>
                    <div className="text-xl font-bold">{formatFixtureDate(fixture.date).day}</div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    <span>{formatFixtureDate(fixture.date).time}</span>
                    <span> • </span>
                    <span>{fixture.isHome ? 'Home Game' : 'Away Game'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${fixture.isHome ? 'bg-primary' : fixture.opposingTeamColor || 'bg-blue-600'} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                      {fixture.isHome ? (team?.abbreviation || getTeamInitials(team?.name || 'DB')) : (fixture.opposingTeamAbbreviation || getTeamInitials(fixture.opposingTeam))}
                    </div>
                    <span className="font-semibold">{fixture.isHome ? (team?.name || 'Deepdene Bears') : fixture.opposingTeam}</span>
                  </div>
                  <span className="text-sm font-semibold">vs</span>
                  <div className="flex items-center">
                    <span className="font-semibold">{fixture.isHome ? fixture.opposingTeam : (team?.name || 'Deepdene Bears')}</span>
                    <div className={`w-12 h-12 ${fixture.isHome ? (fixture.opposingTeamColor || 'bg-blue-600') : 'bg-primary'} rounded-full flex items-center justify-center text-white font-bold ml-3`}>
                      {fixture.isHome ? (fixture.opposingTeamAbbreviation || getTeamInitials(fixture.opposingTeam)) : (team?.abbreviation || getTeamInitials(team?.name || 'DB'))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-neutral-700">
                  <div className="flex items-center">
                    <i className="ri-map-pin-line mr-2"></i>
                    <span>{fixture.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-600">No fixtures scheduled for this team.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FixtureDetail;
