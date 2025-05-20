import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface DataSourceToggleProps {
  dataSource: 'local' | 'playhq';
  onChange: (source: 'local' | 'playhq') => void;
}

export function DataSourceToggle({ dataSource, onChange }: DataSourceToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="sm"
            variant={dataSource === 'playhq' ? 'default' : 'outline'}
            onClick={() => onChange(dataSource === 'playhq' ? 'local' : 'playhq')}
            className="text-xs"
          >
            {dataSource === 'playhq' ? 'Using PlayHQ' : 'Using Local Data'}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">
            {dataSource === 'playhq' 
              ? 'Currently using PlayHQ API data. Click to switch to local fixture data.' 
              : 'Currently using local fixture data. Click to try fetching from PlayHQ API.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}