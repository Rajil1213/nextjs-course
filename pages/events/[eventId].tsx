import React from "react";

import { GetStaticPaths, GetStaticProps } from "next";

import EventContent from "@/components/event-detail/eventContent";
import EventLogistics from "@/components/event-detail/eventLogistics";
import EventSummary from "@/components/event-detail/eventSummary";
import { EventsResponseModel, getEventById } from "@/services/events";

interface EventDetailProps {
  event?: EventsResponseModel;
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
  if (!event) return <p className="center">Loading...</p>;

  return (
    <>
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
    }
  };
};

export const getStaticPaths: GetStaticPaths<{ eventId: string }> = () => {
  const idsToPreload = ["e1", "e2"];
  const paths = idsToPreload.map((eventId) => ({ params: { eventId } }));

  return {
    paths,
    fallback: true
  };
};

export default EventDetail;
