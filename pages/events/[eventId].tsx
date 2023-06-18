import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import EventContent from "@/components/event-detail/eventContent";
import EventLogistics from "@/components/event-detail/eventLogistics";
import EventSummary from "@/components/event-detail/eventSummary";
import Comments from "@/components/input/comments";
import { EventsResponseModel, getAllEvents, getEventById } from "@/services/events";

interface EventDetailProps {
  event?: EventsResponseModel;
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
  if (!event) return <p className="center">Loading...</p>;

  return (
    <>
      <Head>
        <title>{event.title}</title>
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={event.id} />
    </>
  );
};

export const getStaticProps: GetStaticProps<EventDetailProps> = async (context) => {
  const { params } = context;
  if (!params)
    return {
      redirect: true,
      props: {}
    };

  const eventID = params.eventId;
  if (!eventID)
    return {
      redirect: true,
      props: {}
    };

  if (typeof eventID !== "string")
    return {
      redirect: true,
      props: {}
    };

  const event = await getEventById(eventID);

  if (!event)
    return {
      notFound: true,
      props: {}
    };

  return {
    props: {
      event
    },
    revalidate: 10
  };
};

export const getStaticPaths: GetStaticPaths<{ eventId: string }> = async () => {
  // only load featured events
  const allEvents = await getAllEvents();
  const idsToPreload = allEvents.filter((event) => event.isFeatured).map((event) => event.id);

  const paths = idsToPreload.map((eventId) => ({ params: { eventId } }));

  return {
    paths,
    fallback: true
  };
};

export default EventDetail;
