import JourneyFareCalculation from "./JourneyFareCalculation";

/**
 * Factory class for managing JourneyFareCalculation instances per user
 * Ensures that each userId is associated with one journey fare calculation instance,
 * thus fare calculations remain consistent across multiple calls for the same user
 */
export default class JourneyCalculatorFactory {
    private static userJourney: Map<string, JourneyFareCalculation> = new Map ();

    static createForUser(userId: string) :JourneyFareCalculation {
        if (!this.userJourney.has(userId)) {
            this.userJourney.set(userId, new JourneyFareCalculation());
        }

        return this.userJourney.get(userId)!;
    }
}
