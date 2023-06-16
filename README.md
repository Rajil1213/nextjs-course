# Project: Pre-rendering and Data Fetching

## Setup

- Migrate the dummy data to firebase by creating a dummy realtime database

## SSG on the Homepage

- This page requires SEO and is not likely to change too often.
- So, either static site generation or server side props.
- Here, `getServerSideProps` would make more sense as we do not need to update it on every request.
- For this, we will create a `services` directory that talks with the firebase API (make sure you set up a test realtime database).
- We will also validate the response coming from the API with `zod`
- We will get the API base URI from the node environment using the `dotenv` package. You need to prepend `NODE_ENV=development` to the `dev` script in `package.json`:

```tsx
// services/events.ts

import dotenv from "dotenv";
import { z } from "zod";

// load config from .env.[NODE_ENV].local
// make sure to prepend NODE_ENV=development to the `dev` script in package.json
dotenv.config({
  path: process.cwd() + `.env.${process.env.NODE_ENV}.local`
});

export const EventResponse = z.object({
  id: z
    .string({ required_error: "id is required" })
    .trim()
    .min(2, "id must be at least two characters")
    .startsWith("e", "id must start with e"),
  title: z.string({ required_error: "title is required" }).trim().min(1, "title cannot be empty"),
  description: z.string({ required_error: "description is required" }),
  image: z
    .string({ required_error: "image is required" })
    .trim()
    .startsWith("images", "path to images must begin with `images`"),
  location: z
    .string({ required_error: "location is required" })
    .trim()
    .min(1, "location cannot be empty"),
  date: z.date(),
  isFeatured: z.boolean()
});

export type EventsResponseModel = z.infer<typeof EventResponse>;

export const getAllEvents = async (): Promise<Array<EventsResponseModel>> => {
  const resp = await fetch(`${process.env.FIREBASE_URI}/events`);
  const data = await resp.json();

  const respEvents: Array<EventsResponseModel> = [];

  // transform data
  for (const key in data) {
    respEvents.push({
      id: key,
      ...data[key]
    });
  }

  // validate against zod schema
  const events = z.array(EventResponse).parse(respEvents);
  return events;
};
```

We can replace our `EventInfo` type from the previous project with that from zod (`EventsResponse`).

- We then, use it in our homepage as well as the `allEvents` page:
  ```tsx
  interface HomePageProps {
    featuredEvents: Array<EventsResponseModel>;
  }

  export default function Home(props: HomePageProps) {
    return (
      <div>
        <EventsList events={props.featuredEvents} />
      </div>
    );
  }

  export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    const events = await getAllEvents();
    const featuredEvents = events.filter((event) => event.isFeatured);

    return {
      props: {
        featuredEvents
      },
      revalidate: 20
    };
  };
  ```

## For Dynamic Pages

- We also want the individual event pages to be crawlable as well.
- So, we define another function insides the events’ service that gets events by their id:
  ```tsx
  export const getEventById = async (id: string): Promise<EventsResponseModel | undefined> => {
    const events = await getAllEvents();
    const event = events.find((event) => event.id === id);

    return event;
  };
  ```
- We can then, use this service inside `getStaticProps` in our `[eventId].tsx` page:
  ```tsx
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
      },
      revalidate: 20
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
  ```

## Slug Page

- Will need server side props as we cannot determine which filter to pre-generate for
- Moreover, this page does not really need SEO. So, we can use client-side fetching as well instead of ServerSideProps
- With server side props:
  ```tsx
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
  ```
