import { SportEvent, Sport } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchESPNScores(sport?: Sport): Promise<SportEvent[]> {
  const url = new URL(`${SUPABASE_URL}/functions/v1/espn-scores`);
  if (sport) {
    url.searchParams.set('sport', sport);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch scores');
  }

  const data = await response.json();
  return transformESPNData(data);
}

function transformESPNData(data: any): SportEvent[] {
  // Handle both single sport and multiple sports responses
  const sportsData = Array.isArray(data) ? data : [data];
  
  return sportsData.flatMap(sportData => {
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