import { JourneyDetails } from "./types";
import JourneyCalculatorFactory from "./classes/JourneyCalculatorFactory";
import JourneyFareCalculation from "./classes/JourneyFareCalculation";

/**
 * Runs the journey fare calculation for an array of journey details
 * @param userData - Array of JourneyDetails objects representing trips
 * @returns An instance of JourneyFareCalculation containing calculated fares
 */
export function runJourneyCalculation(userData: JourneyDetails[]) :JourneyFareCalculation {
    if (!Array.isArray(userData)) {
        throw new TypeError(
          `Expected an array of JourneyDetails, but got ${typeof userData}`
        );
    }
    const journey = new JourneyFareCalculation();
    if (userData.length === 0) return journey;

    userData.forEach((j) => journey.calculateFareForTheDayandWeek(j));
    return journey;
}

/**
 * Runs the journey fare calculation for an array of journey details per user
 * @param userId - user who made the journeys
 * @param userData - Array of JourneyDetails objects representing trips by userId
 * @returns An instance of JourneyFareCalculation containing calculated fares for the given userId
 */
export function runJourneyCalculationPerUser(userId: string, userData: JourneyDetails[]) :JourneyFareCalculation {
    if (typeof userId != "string") {
        throw new TypeError(
            `Expected string for userId, but got ${typeof userId}`
        );
    }
    if (!Array.isArray(userData)) {
        throw new TypeError(
            `Expected an array of JourneyDetails, but got ${typeof userData}`
        );
    }

    const userJourney = JourneyCalculatorFactory.createForUser(userId);
    if (userData.length === 0) return userJourney;

    userData.forEach((j) => userJourney.calculateFareForTheDayandWeek(j));
    return userJourney;
}
