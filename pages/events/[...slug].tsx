import React from "react";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import EventsList from "@/components/events/eventList";
import ResultsTitle from "@/components/events/resultsTitle";
import Button from "@/components/ui/button";
import ErrorAlert from "@/components/ui/errorAlert";
import { EventsResponseModel, getFilteredEvents } from "@/services/events";

type FilteredEventsProps =
  | {
      filteredEvents: Array<EventsResponseModel>;
      hasError: false;
    }
  | {
      filteredEvents: Record<string, never>;
      hasError: true;
    };

const FilteredEvents: React.FC<FilteredEventsProps> = (props) => {
  const router = useRouter();

  const invalidFilter = (
    <div className="center">
      <ErrorAlert>
        <p>Invalid Filter</p>
      </ErrorAlert>
      <Button link="/events">Show All Events</Button>
    </div>
  );

  // invalid cases
  if (props.hasError) return invalidFilter;

  return (
    <>
      <ResultsTitle date={`${router.query?.slug}`} />
      <EventsList events={props.filteredEvents} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<FilteredEventsProps> = async (context) => {
  const slug = context.params?.slug;
  const errorProps: { props: FilteredEventsProps } = {
    props: {
      filteredEvents: {},
      hasError: true
    }
  };

  if (!slug || !Array.isArray(slug) || slug.length !== 2) {
    return errorProps;
  }

  const [year, month] = slug;
  const numYear = +year;
  const numMonth = +month;

  if (isNaN(numYear) || isNaN(numMonth)) return errorProps;

  const filteredEvents = await getFilteredEvents(numYear, numMonth);
  return {
    props: {
      filteredEvents,
      hasError: false
    }
  };
};

export default FilteredEvents;
