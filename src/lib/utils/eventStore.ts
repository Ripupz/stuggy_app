import { create } from "zustand";

type EventData = {
  title: string;
  time: string;
  date: string;
  priority: string;
};

type EventsMap = { [date: string]: EventData[] };

type EventStore = {
  events: EventsMap;
  setEvents: (events: EventsMap) => void;
};

export const useEventStore = create<EventStore>((set) => ({
  events: {},
  setEvents: (events) => set({ events }),
}));