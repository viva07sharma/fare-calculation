import { Day, Weekday, Weekend } from "../types";

/**
 * Interface declaring methods to determine if a given day is a weekday or weekend.
 */
export interface PeakAndOffPeakRules {
    /**
     * @param day - The day to check
     * @returns true if day is Weekday, false otherwise
     */
    isWeekday(day: Day): day is Weekday;

    /**
     * @param day - The day to check
     * @returns true if day is Weekend, false otherwise
     */
    isWeekend(day: Day): day is Weekend;
}