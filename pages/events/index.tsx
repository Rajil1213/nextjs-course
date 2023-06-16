import React from "react";

import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import EventsList from "@/components/events/eventList";
import EventsSearch from "@/components/events/eventsSearch";
import { EventsResponseModel, getAllEvents } from "@/services/events";

interface EventsProps {
  events?: Array<EventsResponseModel>;
}

const Events: React.FC<EventsProps> = (props) => {
  const router = useRouter();

  if (!props.events) {
    return <p className="center">Loading...</p>;
  }

  const eventsSearchHandler = (year: string, month: string) => {
    const filteredEventsPath = `/events/${year}/${month}`;
    router.push(filteredEventsPath);
  };

  return (
    <>
      <Head>
        <title>All NextJS Events</title>
        <meta name="description" content="Check out all events" />
      </Head>
      <EventsSearch onSearch={eventsSearchHandler} />
      <EventsList events={props.events} />
    </>
  );
};

export const getStaticProps: GetStaticProps<EventsProps> = async () => {
  const events = await getAllEvents();

  return {
    props: {
      events
    },
    revalidate: 10
  };
};

export default Events;
