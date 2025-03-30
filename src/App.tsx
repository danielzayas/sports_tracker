import React, { useState, useEffect, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { SportEvent, Sport } from './types';
import { FilterBar } from './components/FilterBar';
import { EventSection } from './components/EventSection';
import { fetchESPNScores } from './lib/espn';

function App() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeagues, setSelectedLeagues] = useState<Set<Sport>>(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await fetchESPNScores();
        setEvents(data);
        setError(null);
        setInitialLoadComplete(true);
      } catch (err) {
        setError('Failed to fetch sports data');
        console.error(err);
      }
    };

    fetchScores();
    // Refresh data every 30 seconds
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

export default App;