/* eslint-disable @next/next/no-img-element */
import React from "react";

import AddressIcon from "../icons/addressIcon";
import ArrowRightIcon from "../icons/arrowRightIcon";
import DateIcon from "../icons/dateIcon";
import Button from "../ui/button";
import classes from "./event.module.css";

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
      <img src={`/` + `${event.image}`} alt={event.title} />
      <div className={classes.content}>
        <div className={classes.summary}>
          <h2>{event.title}</h2>
          <div className={classes.date}>
            <DateIcon />
            <time>{readableDate}</time>
          </div>
          <div className={classes.address}>
            <AddressIcon />
            <address>{formattedAddress}</address>
          </div>
        </div>
        <div className={classes.actions}>
          <Button link={`/events/${event.id}`}>
            <span className={classes.icon}>
              <ArrowRightIcon />
            </span>
            <span>Explore Event</span>
          </Button>
        </div>
      </div>
    </li>
  );
};

export default Event;
