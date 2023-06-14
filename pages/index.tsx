import { Inter } from 'next/font/google';

import EventsList from '@/components/events/eventList';
import { getFeaturedEvents } from '@/data/dummy-data';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const featuredEvents = getFeaturedEvents();

  return (
    <div>
      <EventsList events={featuredEvents} />
    </div>
  );
}
