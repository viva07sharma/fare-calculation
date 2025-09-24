import { HourSlots } from "../types";

/**
 * Peak hour time slots for calculating fare.
 * 
 * weekday_slots: Array of peak time ranges for weekdays
 * weekend_slots: Array of peak time ranges for weekends
 */
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
