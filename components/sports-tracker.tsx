'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { SportEvent, Sport } from '@/lib/types';
import { FilterBar } from './filter-bar';
import { EventSection } from './event-section';

function transformESPNData(data: any): SportEvent[] {
  const sportsData = Array.isArray(data) ? data : [data];
  
  return sportsData.flatMap(sportData => {
    if (sportData.error || !sportData.data?.events) return [];
    
    const events = sportData.data.events || [];
    return events.map((event: any) => ({
      id: event.id,
      sport: sportData.sport,
      title: event.name,
      startTime: event.date,
      location: event.venue?.fullName || 'TBD',
      status: getEventStatus(event),
      participants: event.competitions[0].competitors.map((team: any) => ({
        id: team.id,
        name: team.team.name,
        imageUrl: team.team.logo || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=100&h=100&fit=crop',
        type: 'team'
      })),
      score: getEventScore(event),
      timeRemaining: event.status.displayClock,
      timeElapsed: event.status.type.description,
      broadcast: {
        channel: event.competitions[0].broadcasts?.[0]?.names?.[0] || 'TBD',
        streamingUrl: event.links?.[0]?.href
      }
    }));
  });
}

function getEventStatus(event: any): SportEvent['status'] {
  const statusType = event.status.type.state.toLowerCase();
  if (statusType === 'in') return 'live';
  if (statusType === 'post') return 'completed';
  return 'upcoming';
}

function getEventScore(event: any): string {
  if (!event.competitions[0].competitors) return '';
  
  const competitors = event.competitions[0].competitors;
  return competitors.map((team: any) => 
    `${team.team.abbreviation} ${team.score}`
  ).join(' - ');
}

export function SportsTracker() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<Set<Sport>>(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/espn-scores');
        if (!response.ok) throw new Error('Failed to fetch scores');
        const data = await response.json();
        setEvents(transformESPNData(data));
        setError(null);
        setInitialLoadComplete(true);
      } catch (err) {
        setError('Failed to fetch sports data');
        console.error(err);
        setInitialLoadComplete(true);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLeagueToggle = (sport: Sport) => {
    setSelectedLeagues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sport)) {
        newSet.delete(sport);
      } else {
        newSet.add(sport);
      }
      return newSet;
    });
  };

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (selectedLeagues.size > 0) {
      filtered = filtered.filter(event => selectedLeagues.has(event.sport));
    }

    return {
      live: filtered
        .filter(event => event.status === 'live')
        .sort((a, b) => {
          if (a.timeRemaining && b.timeRemaining) {
            return a.timeRemaining.localeCompare(b.timeRemaining);
          }
          if (a.timeElapsed && b.timeElapsed) {
            return b.timeElapsed.localeCompare(a.timeElapsed);
          }
          return 0;
        }),
      upcoming: filtered
        .filter(event => event.status === 'upcoming')
        .filter(event => {
          const eventDate = new Date(event.startTime);
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
          return eventDate <= sevenDaysFromNow;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    };
  }, [selectedLeagues, events]);

  if (!initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-teal-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-500">Loading sports data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-teal-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sports Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          selectedLeagues={selectedLeagues}
          onLeagueToggle={handleLeagueToggle}
        />

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8">
          <EventSection title="Live Now" events={filteredEvents.live} />
          <EventSection title="Upcoming Events" events={filteredEvents.upcoming} />
        </div>

        {filteredEvents.live.length === 0 && filteredEvents.upcoming.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found for the selected leagues.</p>
          </div>
        )}
      </main>
    </div>
  );
}
