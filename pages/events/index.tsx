import React from "react";

import { useRouter } from "next/router";

import EventsList from "@/components/events/eventList";
import EventsSearch from "@/components/events/eventsSearch";
import { getAllEvents } from "@/data/dummy-data";

const Events = () => {
  const allEvents = getAllEvents();
  const router = useRouter();

  const eventsSearchHandler = (year: string, month: string) => {
    const filteredEventsPath = `/events/${year}/${month}`;
    router.push(filteredEventsPath);
  };

  return (
    <>
      <EventsSearch onSearch={eventsSearchHandler} />
      <EventsList events={allEvents} />
    </>
  );
};

export default Events;
