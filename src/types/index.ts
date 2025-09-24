/**
 * Weekdays names
 */
export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

/**
 * Weekends names
 */
export const weekends = ["Saturday", "Sunday"] as const;

/**
 * Zones in the system
 */
export const zones = [1, 2] as const;

/**
 * Type representing weekdays
 */
export type Weekday = typeof weekdays[number];

/**
 * Type representing weekends
 */
export type Weekend = typeof weekends[number];

/**
 * Type representing any day
 */
export type Day = Weekday | Weekend;

/**
 * Type representing Time representation as start and end times
 */
export type TimeRange = { start: string; end: string };

/**
 * Type representing valid travel zones
 */
export type Zone = typeof zones[number];

/**
 * Type representing zone keys as string (e.g. "1-1" , "1-2" etc.)
 */
export type ZoneKey = `${Zone}-${Zone}`;

/**
 * Type representing Zone cost by peak and offpeak
 */
export type ZoneCost = { peakCost: number; offPeakCost: number };

/**
 * Types representing daily and weekly cost caps
 */
export type CostCap = { daily: number; weekly: number };

/**
 * Type representing a trip cost by Zone combination that's an object of ZoneKey as key (e.g. "1-2") and ZoneCost as value
 */
export type TripCost = Record<ZoneKey, ZoneCost>;

/**
 * Type representing Cost Cap limits by Zone, an object with ZoneKey as key (e.g. "1-2") and valus as CostCap based on daily, weekly limits
 */
export type ZonalCappingLimits = Record<ZoneKey, CostCap>;

/**
 * Types representing details of Journey
 */
export type JourneyDetails = {
  day: Day;
  time: string;
  fromZone: Zone;
  toZone: Zone;
};

/**
 * Type representing weekday and weekend hour slots defined as array of TimeRange type
 */
export type HourSlots = { weekday_slots: TimeRange[]; weekend_slots: TimeRange[] };
