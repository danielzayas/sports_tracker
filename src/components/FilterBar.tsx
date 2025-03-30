import React, { useState } from 'react';
import { Sport, SPORT_LABELS } from '../types';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedLeagues: Set<Sport>;
  onLeagueToggle: (sport: Sport) => void;
}

export function FilterBar({ selectedLeagues, onLeagueToggle }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-5 w-5 text-teal-600" />
        <span className="text-sm font-medium text-gray-700">
          {selectedLeagues.size > 0 
            ? `${selectedLeagues.size} League${selectedLeagues.size > 1 ? 's' : ''} Selected`
            : 'Filter Leagues'}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {Object.entries(SPORT_LABELS).map(([sport, label]) => (
              <button
                key={sport}
                onClick={() => onLeagueToggle(sport as Sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedLeagues.has(sport as Sport)
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {selectedLeagues.has(sport as Sport) ? `✓ ${label}` : label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}