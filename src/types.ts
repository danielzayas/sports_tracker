export interface Participant {
  id: string;
  name: string;
  imageUrl: string;
  type: 'individual' | 'team';
}

export interface Broadcast {
  channel: string;
  streamingUrl?: string;
}

export interface SportEvent {
  id: string;
  sport: Sport;
  title: string;
  startTime: string;
  endTime?: string;
  location: string;
  status: 'upcoming' | 'live' | 'completed';
  participants: Participant[];
  score?: string;
  timeRemaining?: string;
  timeElapsed?: string;
  broadcast: Broadcast;
}

export type Sport = 
  | 'MENS_NCAA_BASKETBALL'
  | 'WOMENS_NCAA_BASKETBALL'
  | 'NBA'
  | 'WNBA'
  | 'NHL'
  | 'MLB'
  | 'COLLEGE_BASEBALL'
  | 'EPL'
  | 'MLS';

export const SPORT_LABELS: Record<Sport, string> = {
  MENS_NCAA_BASKETBALL: "Men's NCAA Basketball",
  WOMENS_NCAA_BASKETBALL: "Women's NCAA Basketball",
  NBA: "NBA",
  WNBA: "WNBA",
  NHL: "NHL",
  MLB: "MLB",
  COLLEGE_BASEBALL: "College Baseball",
  EPL: "English Premier League",
  MLS: "Major League Soccer"
};

export type FilterType = 'leagues' | 'all';