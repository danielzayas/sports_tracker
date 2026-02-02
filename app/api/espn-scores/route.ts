import { NextRequest, NextResponse } from 'next/server';

interface SportConfig {
  id: string;
  name: string;
  endpoint: string;
}

const SPORTS: SportConfig[] = [
  {
    id: 'NHL',
    name: 'NHL',
    endpoint: 'hockey/nhl'
  },
  {
    id: 'MENS_NCAA_BASKETBALL',
    name: "Men's NCAA Basketball",
    endpoint: 'basketball/mens-college-basketball'
  },
  {
    id: 'WOMENS_NCAA_BASKETBALL',
    name: "Women's NCAA Basketball",
    endpoint: 'basketball/womens-college-basketball'
  },
  {
    id: 'NBA',
    name: 'NBA',
    endpoint: 'basketball/nba'
  },
  {
    id: 'WNBA',
    name: 'WNBA',
    endpoint: 'basketball/wnba'
  },
  {
    id: 'MLB',
    name: 'MLB',
    endpoint: 'baseball/mlb'
  },
  {
    id: 'COLLEGE_BASEBALL',
    name: 'College Baseball',
    endpoint: 'baseball/college-baseball'
  },
  {
    id: 'EPL',
    name: 'English Premier League',
    endpoint: 'soccer/eng.1'
  },
  {
    id: 'MLS',
    name: 'Major League Soccer',
    endpoint: 'soccer/usa.1'
  }
];

async function fetchESPNData(sport: SportConfig) {
  const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports';
  const response = await fetch(`${baseUrl}/${sport.endpoint}/scoreboard`, {
    next: { revalidate: 30 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sport.name} data`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get('sport');
    
    if (!sportId) {
      // Fetch all sports
      const results = await Promise.all(
        SPORTS.map(async (sport) => {
          try {
            const data = await fetchESPNData(sport);
            return {
              sport: sport.id,
              data
            };
          } catch (error) {
            console.error(`Error fetching ${sport.name}:`, error);
            return {
              sport: sport.id,
              error: `Failed to fetch ${sport.name} data`
            };
          }
        })
      );

      return NextResponse.json(results);
    }

    // Fetch specific sport
    const sport = SPORTS.find(s => s.id === sportId);
    if (!sport) {
      return NextResponse.json(
        { error: 'Sport not found' },
        { status: 404 }
      );
    }

    const data = await fetchESPNData(sport);
    return NextResponse.json({ sport: sport.id, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
