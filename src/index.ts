import { JourneyDetails } from "./types";
import JourneyFareCalculation from "./classes/JourneyFareCalculation";

export function runJourneyCalculation(userData: JourneyDetails[]) {
  const journey = new JourneyFareCalculation();
  userData.forEach((j) => journey.calculateFareForTheDay(j));
  return journey;
}
