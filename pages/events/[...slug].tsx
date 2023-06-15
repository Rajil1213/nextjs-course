import React from "react";

import { useRouter } from "next/router";

import EventsList from "@/components/events/eventList";
import ResultsTitle from "@/components/events/resultsTitle";
import Button from "@/components/ui/button";
import { getFilteredEvents } from "@/data/dummy-data";

const FilteredEvents = () => {
  const router = useRouter();
  const filterData = router.query.slug;

  if (!filterData) {
    return <p className="center">Loading...</p>;
  }

  const invalidFilter = (
    <div className="center">
      <h1>Invalid Filter</h1>
      <Button link="/events">Show All Events</Button>
    </div>
  );

  if (!Array.isArray(filterData)) return invalidFilter;
  if (filterData.length !== 2) return invalidFilter;

  const [year, month] = filterData;
  const numYear = +year;
  const numMonth = +month;

  // invalid cases
  if (isNaN(numYear) || isNaN(numMonth) || numMonth > 12 || numMonth < 1) return invalidFilter;

  const filteredEvents = getFilteredEvents({ year: numYear, month: numMonth });

  return (
    <>
      <ResultsTitle date={`${year}/${month}`} />
      <EventsList events={filteredEvents} />
    </>
  );
};

export default FilteredEvents;
