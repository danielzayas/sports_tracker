import React from 'react';
import { Tv } from 'lucide-react';
import { SportEvent, SPORT_LABELS } from '../types';

interface EventCardProps {
  event: SportEvent;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.startTime);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-teal-600">
          {SPORT_LABELS[event.sport]}
        </span>
        {event.status === 'live' && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {event.timeRemaining || (event.timeElapsed ? `${event.timeElapsed} elapsed` : 'LIVE')}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{event.title}</h3>

      {event.status === 'live' ? (
        <div className="space-y-4">
          {event.participants.map(participant => (
            <div key={participant.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={participant.imageUrl}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{participant.name}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {event.score?.split(' - ')[event.participants.indexOf(participant)]}
              </span>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600">
              <Tv className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">
                Watch on: {event.broadcast.channel}
                {event.broadcast.streamingUrl && (
                  <a 
                    href={event.broadcast.streamingUrl}
                    className="ml-1 text-teal-600 hover:text-teal-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (Stream)
                  </a>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 mb-4">
            {event.participants.map(participant => (
              <div key={participant.id} className="flex items-center space-x-2">
                <img
                  src={participant.imageUrl}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{participant.name}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <span className="text-sm">{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center">
              <Tv className="w-4 h-4 mr-2 text-teal-600" />
              <span className="text-sm">
                Watch on: {event.broadcast.channel}
                {event.broadcast.streamingUrl && (
                  <a 
                    href={event.broadcast.streamingUrl}
                    className="ml-1 text-teal-600 hover:text-teal-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (Stream)
                  </a>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}