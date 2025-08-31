import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeamFixtures, fetchTeamDetails, fetchPlayHQFixtures } from "@/lib/api";
import { Fixture } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataSourceToggle } from "@/components/ui/data-source-toggle";

const FixtureDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<'local' | 'playhq'>('local');
  
  // Define the PlayHQ grade ID for winter team
  const WINTER_TEAM_ID = "5"; // Database ID for the Deepdene Bears Winter XI
  
  // Enhance display for winter team
  const isWinterTeam = teamId === WINTER_TEAM_ID;
  
  // For PlayHQ API calls, simply use the team ID
  // The server will determine the correct PlayHQ grade ID based on credentials
  const playHQGradeId = teamId;

  // Fetch team details
  const { 
    data: team,
    isLoading: teamLoading,
    error: teamError
  } = useQuery<any>({
    queryKey: [`/api/teams/${teamId}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch team fixtures (local)
  const { 
    data: localFixtures,
    isLoading: localFixturesLoading,
    error: localFixturesError
  } = useQuery<any[]>({
    queryKey: [`/api/teams/${teamId}/fixtures`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch PlayHQ fixtures for this team
  const { 
    data: playhqFixtures,
    isLoading: playhqFixturesLoading,
    error: playhqFixturesError,
    refetch: refetchPlayHQFixtures
  } = useQuery<any[]>({
    queryKey: [`/api/playhq/fixtures/${teamId}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: dataSource === 'playhq', // Only fetch when this data source is selected
  });
  
  // Auto-switch to PlayHQ data for winter team, but only when credentials are available
  useEffect(() => {
    const tryPlayHQData = async () => {
      if (teamId === WINTER_TEAM_ID.toString() && dataSource === 'local') {
        try {
          // Attempt to get fixture data from PlayHQ
          await refetchPlayHQFixtures();
          // If we get here, it was successful
          setDataSource('playhq');
        } catch (error) {
          console.log('PlayHQ data not available, staying with local data');
          // Stay with local data if PlayHQ fails
        }
      }
    };
    
    tryPlayHQData();
  }, [teamId, refetchPlayHQFixtures]);
  
  // Determine which fixtures to display based on the selected data source
  const fixtures = dataSource === 'playhq' ? (playhqFixtures || []) : (localFixtures || []);
  const fixturesLoading = dataSource === 'playhq' ? playhqFixturesLoading : localFixturesLoading;
  const fixturesError = dataSource === 'playhq' ? playhqFixturesError : localFixturesError;

  const isLoading = teamLoading || fixturesLoading;
  const hasError = teamError || fixturesError;
  
  // Check if we're showing fallback data despite PlayHQ being selected
  const usingFallbackData = dataSource === 'playhq' && playhqFixturesError;
  
  // Toggle between data sources
  const toggleDataSource = (newSource: 'local' | 'playhq') => {
    console.log(`Switching data source from ${dataSource} to ${newSource}`);
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
        <div>
          <h2 className="text-xl font-heading font-bold">
            {teamLoading ? 'Loading...' : team ? `${team.name} Fixtures` : 'Team Fixtures'}
          </h2>
          {isWinterTeam && (
            <p className="text-xs text-neutral-600">
              East Division - Mamgain Shield, Mid Year Cricket Association
            </p>
          )}
        </div>
        <div className="ml-auto">
          <div className="flex flex-col items-end">
            <DataSourceToggle 
              dataSource={dataSource} 
              onChange={toggleDataSource} 
            />
            {usingFallbackData && (
              <div className="text-amber-600 text-xs mt-1 flex items-center">
                <i className="ri-error-warning-line mr-1"></i>
                PlayHQ API unavailable - using local data
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* API Status Banner */}
      {dataSource === 'playhq' && playhqFixturesError && (
        <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <i className="ri-error-warning-line text-red-600 mr-2"></i>
            <div className="flex-1">
              <p className="text-red-800 font-medium text-sm">PlayHQ API Error</p>
              <p className="text-red-700 text-xs">Showing fallback data instead</p>
            </div>
            <Button 
              onClick={() => refetchPlayHQFixtures()} 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      
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
              <div className="text-center">
                <i className="ri-error-warning-line text-error text-4xl mb-3"></i>
                {dataSource === 'playhq' ? (
                  <div>
                    <p className="text-error font-semibold mb-2">PlayHQ API Connection Failed</p>
                    <p className="text-sm text-neutral-600 mb-4">
                      {playhqFixturesError?.message || "Unable to connect to PlayHQ servers."}
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-amber-800 font-medium mb-2">Common causes:</p>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• API credentials expired or invalid</li>
                        <li>• PlayHQ server maintenance</li>
                        <li>• Network connectivity issues</li>
                        <li>• API rate limits exceeded</li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button 
                        onClick={() => toggleDataSource('local')} 
                        variant="outline"
                        size="sm"
                      >
                        Switch to Local Data
                      </Button>
                      <Button 
                        onClick={() => refetchPlayHQFixtures()} 
                        size="sm"
                      >
                        Retry PlayHQ Connection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-error font-semibold">Failed to load fixtures</p>
                    <p className="text-sm text-neutral-600 mt-1">Please try again later or contact support.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : Array.isArray(fixtures) && fixtures.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {fixtures.map((fixture: any) => (
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
              <div className="text-center py-8">
                <i className="ri-calendar-2-line text-4xl text-neutral-400 mb-4"></i>
                <h3 className="font-semibold text-lg mb-2">No fixtures available</h3>
                <p className="text-neutral-600 text-sm mb-4">
                  There are currently no fixtures scheduled for this team.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs text-neutral-500 text-center">
                    {dataSource === 'playhq' ? (
                      <>Check PlayHQ or switch to local data for updates</>
                    ) : (
                      <>New fixtures will appear here when they're added</>
                    )}
                  </div>
                  {dataSource === 'local' && (
                    <Button 
                      onClick={() => toggleDataSource('playhq')} 
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Try PlayHQ Data
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FixtureDetail;
