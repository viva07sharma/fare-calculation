import { HourSlots } from "../types";

export const PEAK_HOUR_SLOTS: HourSlots = {
  weekday_slots: [
    { start: "07:00", end: "10:30" },
    { start: "17:00", end: "20:00" },
  ],
  weekend_slots: [
    { start: "09:00", end: "11:00" },
    { start: "18:00", end: "22:00" },
  ],
} as const;
