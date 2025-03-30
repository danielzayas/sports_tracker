import React from 'react';
import { SportEvent } from '../types';
import { EventCard } from './EventCard';

interface EventSectionProps {
  title: string;
  events: SportEvent[];
}

export function EventSection({ title, events }: EventSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}