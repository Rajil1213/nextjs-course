import React from 'react';

import Event, { EventInfo } from './event';
import classes from './eventList.module.css';

interface EventsListProps {
  events: Array<EventInfo>;
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <ul className={classes.list}>
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </ul>
  );
};

export default EventsList;
