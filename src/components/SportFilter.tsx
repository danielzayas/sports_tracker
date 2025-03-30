import React from 'react';
import { Sport, SPORT_LABELS } from '../types';

interface SportFilterProps {
  selectedSport: Sport | 'ALL';
  onSelectSport: (sport: Sport | 'ALL') => void;
}

export function SportFilter({ selectedSport, onSelectSport }: SportFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectSport('ALL')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${selectedSport === 'ALL' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        All Sports
      </button>
      {Object.entries(SPORT_LABELS).map(([sport, label]) => (
        <button
          key={sport}
          onClick={() => onSelectSport(sport as Sport)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedSport === sport 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}