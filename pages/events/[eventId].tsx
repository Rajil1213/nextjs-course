import React from "react";

import { useRouter } from "next/router";

import EventContent from "@/components/event-detail/eventContent";
import EventLogistics from "@/components/event-detail/eventLogistics";
import EventSummary from "@/components/event-detail/eventSummary";
import ErrorAlert from "@/components/ui/errorAlert";
import { getEventById } from "@/data/dummy-data";

const EventDetail = () => {
  const router = useRouter();
  const eventId = router.query.eventId;

  if (!eventId) {
    return (
      <ErrorAlert>
        <p>NO EVENT FOUND</p>
      </ErrorAlert>
    );
  }

  if (typeof eventId === "object") {
    return <p>Malformed Query Params</p>;
  }

  const event = getEventById(eventId);
  if (!event) {
    return (
      <ErrorAlert>
        <p>Event with id {eventId} not found.</p>
      </ErrorAlert>
    );
  }

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

export default EventDetail;
