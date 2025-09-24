export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
export const weekends = ["Saturday", "Sunday"] as const;
export const zones = [1, 2] as const;

export type Weekday = typeof weekdays[number];
export type Weekend = typeof weekends[number];
export type Day = Weekday | Weekend;

export type TimeRange = { start: string; end: string };

export type Zone = typeof zones[number];
export type ZoneKey = `${Zone}-${Zone}`;

export type ZoneCost = { peakCost: number; offPeakCost: number };
export type CostCap = { daily: number; weekly: number };
export type TripCost = Record<ZoneKey, ZoneCost>;
export type ZonalCappingLimits = Record<ZoneKey, CostCap>;

export type JourneyDetails = {
  day: Day;
  time: string;
  fromZone: Zone;
  toZone: Zone;
};

export type HourSlots = { weekday_slots: TimeRange[]; weekend_slots: TimeRange[] };
