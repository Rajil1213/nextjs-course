# Project: Event Management

## Planning the Project

- Show featured events in the home page
- Show all events in the `/events` route
- Show information about a particular event with the `/events/:id` route
- Filter events by date (year and month) with the `/events/:slug`

## Setup

- Create files that reflect the above routes
- Add Dummy Data
- Each event will also have an image. These images need to be stored in the `public` directory.
- This directory is special in that the files in this directory are served statically by Next

## Creating Regular React Components

- These should not be in the `pages` directory as they become routes
- So, we create a new directory called `components`
- In here, we create a component that can be reused across all our pages namely, the `Event` component that contains the event details:
  ```tsx
  /* eslint-disable @next/next/no-img-element */
  import React from "react";

  import Link from "next/link";

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
    return (
      <li>
        <img src={`/` + `${event.image}`} alt={event.title} />
        <div>
          <div>
            <h2>{event.title}</h2>
            <div>
              <time>{readableDate}</time>
            </div>
            <div>
              <address>{event.location}</address>
            </div>
          </div>
          <div>
            <Link href="">Explore Event</Link>
          </div>
        </div>
      </li>
    );
  };

  export default Event;
  ```
- This component can then be used in a another component that display a list of Events which then can be used in the homepage:
  ```tsx
  import EventsList from "@/components/events/eventList";
  import { getFeaturedEvents } from "@/data/dummy-data";

  export default function Home() {
    const featuredEvents = getFeaturedEvents();

    return (
      <div>
        <h1>The Home Page</h1>
        <EventsList events={featuredEvents} />
      </div>
    );
  }
  ```

## Adding Styling

- Next support scoped CSS modules out-of-the-box
- We define the css inside a `*module.css` file located next to the component where it is to be applied.
- We then import it in our component:
  ```tsx
  import classes from "./eventList.module.css";

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
  ```

## Adding Buttons and Icons

- For these reusable UI components, we create a `components/ui` directory.
- For icons, we create `components/icon` directory with icons from heroicons

## Adding the Event Detail Page

- Create components and use `useRouter` to fetch the information about IDs
  ```tsx
  import React from "react";

  import { useRouter } from "next/router";

  import EventContent from "@/components/event-detail/eventContent";
  import EventLogistics from "@/components/event-detail/eventLogistics";
  import EventSummary from "@/components/event-detail/eventSummary";
  import { getEventById } from "@/data/dummy-data";

  const EventDetail = () => {
    const router = useRouter();
    const eventId = router.query.eventId;

    if (!eventId) {
      return <p>NO EVENT FOUND</p>;
    }

    if (typeof eventId === "object") {
      return <p>Malformed Query Params</p>;
    }

    const event = getEventById(eventId);
    if (!event) {
      return <p>Event with id {eventId} not found.</p>;
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
  ```

## Adding a General Layout Wrapper

- This is where the `pages/_app.tsx` file comes into play
- This is the wrapper for all our pages
- Different pages are passed to this component as we switch routes
- Let’s create a `layout` component to style our pages with nav bars.

## All Events

- We can simply reuse the EventsList component and use the `getAllEvents` helper defined in the dummy data.

## Filtering Events

- First create the component
- For this, we need to refactor the Button component so that it can also accept a click handler and we render a no-link button if it is passed:
  ```tsx
  type ButtonProps =
    | {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
        link?: never;
      }
    | {
        link: string;
        onClick?: never;
      };

  const Button: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
    if (props.onClick) {
      return (
        <button className={classes.btn} onClick={props.onClick}>
          {props.children}
        </button>
      );
    }
    return (
      <Link href={props.link} className={classes.btn}>
        {props.children}
      </Link>
    );
  };

  export default Button;
  ```
- Then, we can create the component itself:
  ```tsx
  const EventsSearch: React.FC<React.PropsWithChildren> = (props) => {
    return (
      <form className={classes.form}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="year">Year</label>
            <select name="year" id="year">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className={classes.control}>
            <label htmlFor="month">Month</label>
            <select name="month" id="month">
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>
        <Button onClick={(e: React.MouseEvent<HTMLButtonElement>) => console.log("clicked")} />
      </form>
    );
  };

  export default EventsSearch;
  ```
- Then, we add the submit logic:
  ```tsx
  const EventsSearch: React.FC<EventsSearchProps> = ({ onSearch }) => {
    const yearRef = useRef<HTMLSelectElement>(null);
    const monthRef = useRef<HTMLSelectElement>(null);

    const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const year = yearRef.current?.value;
      const month = monthRef.current?.value;

      if (!year || !month) {
        console.log("could not get month and year, returning...");
        console.log(`year= ${year}, month= ${month}`);
        return;
      }

      onSearch(year, month);
    };
  ```
  The `yearRef` and `monthRef` are added as refs to the select tags respectively.
- The `onSearch` function is passed from the `events/index.tsx`:
  ```tsx
  	...
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
  ```
- We, then, implement the filter logic in the `[...slug].tsx` file:
  ```tsx
  const FilteredEvents = () => {
    const router = useRouter();
    const filterData = router.query.slug;

    if (!filterData) {
      return <p className="center">Loading...</p>;
    }

    if (!Array.isArray(filterData)) return <p>Invalid Filter</p>;
    if (filterData.length !== 2) return <p>Invalid Filter</p>;

    const [year, month] = filterData;
    const numYear = +year;
    const numMonth = +month;

    if (isNaN(numYear) || isNaN(numMonth) || numMonth > 12 || numMonth < 1)
      return <p>Invalid Filter</p>;

    const filteredEvents = getFilteredEvents({ year: numYear, month: numMonth });

    return (
      <>
        <EventsList events={filteredEvents} />
      </>
    );
  };

  export default FilteredEvents;
  ```
