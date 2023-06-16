import { GetStaticProps } from "next";
import { Inter } from "next/font/google";

import EventsList from "@/components/events/eventList";
import { EventsResponseModel, getAllEvents } from "@/services/events";

const inter = Inter({ subsets: ["latin"] });

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
