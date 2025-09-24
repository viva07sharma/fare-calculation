import { JourneyDetails } from "./types";
import JourneyFareCalculation from "./classes/JourneyFareCalculation";

/**
 * Runs the journey fare calculation for an array of journey details
 * @param userData - Array of JourneyDetails objects representing trips
 * @returns An instance of JourneyFareCalculation containing calculated fares
 */
export function runJourneyCalculation(userData: JourneyDetails[]) {
    if (!Array.isArray(userData)) {
        throw new TypeError(
          `Expected an array of JourneyDetails, but got ${typeof userData}`
        );
    }
    const journey = new JourneyFareCalculation();
    userData.forEach((j) => journey.calculateFareForTheDayandWeek(j));
    return journey;
}
