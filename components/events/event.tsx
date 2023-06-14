/* eslint-disable @next/next/no-img-element */
import React from 'react';

import Link from 'next/link';

import classes from './event.module.css';

export interface EventInfo {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  image: string;
  isFeatured: boolean;
}

interface EventProps {
  event: EventInfo;
}

const Event: React.FC<EventProps> = ({ event }) => {
  const readableDate = new Date(event.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedAddress = event.location.replace(", ", "\n");

  return (
    <li className={classes.item}>
      <img src={event.image} alt={event.title} />
      <div className={classes.content}>
        <div className={classes.summary}>
          <h2>{event.title}</h2>
          <div className={classes.date}>
            <time>{readableDate}</time>
          </div>
          <div className={classes.address}>
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={classes.actions}>
          <Link href={`events/${event.id}`}>Explore Event</Link>
        </div>
      </div>
    </li>
  );
};

export default Event;
