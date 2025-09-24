import { Day, Weekday, Weekend } from "../types";

export interface PeakAndOffPeakRules {
  isWeekday(day: Day): day is Weekday;
  isWeekend(day: Day): day is Weekend;
}