import dotenv from "dotenv";
import { z } from "zod";

// load config from .env.[NODE_ENV].local
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
  date: z
    .string({ required_error: "date is required" })
    .trim()
    .min(1, "date cannot be empty")
    .regex(/\d{4}\-\d{2}\-\d{2}/, "date should be in YYYY-MM-DD format"),
  isFeatured: z.boolean()
});

export type EventsResponseModel = z.infer<typeof EventResponse>;

export const getAllEvents = async (): Promise<Array<EventsResponseModel>> => {
  const uri = `${process.env.FIREBASE_URI}/events.json`;
  console.log(uri);
  const resp = await fetch(uri);
  const data = await resp.json();

  const respEvents: Array<unknown> = [];

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

export const getEventById = async (id: string): Promise<EventsResponseModel | undefined> => {
  const events = await getAllEvents();
  const event = events.find((event) => event.id === id);

  return event;
};

export const getFilteredEvents = async (year: number, month: number) => {
  const allEvents = await getAllEvents();
  const filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
  });

  return filteredEvents;
};
