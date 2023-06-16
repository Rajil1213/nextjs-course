import { GetStaticProps } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

import EventsList from "@/components/events/eventList";
import { EventsResponseModel, getAllEvents } from "@/services/events";

const inter = Inter({ subsets: ["latin"] });

interface HomePageProps {
  featuredEvents: Array<EventsResponseModel>;
}

export default function Home(props: HomePageProps) {
  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta name="description" content="Find the most exciting events near you..." />
      </Head>
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
