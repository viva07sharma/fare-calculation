import { runJourneyCalculation, JourneyDetails, Day } from './../basic';

describe('JourneyFareCalculation', () => {
  it('charges peak fare within peak slots and off-peak fare otherwise', () => {
    const journey = runJourneyCalculation([
      { day: "Monday", time: "08:00", fromZone: 1, toZone: 1 }, // Peak
      { day: "Monday", time: "11:30", fromZone: 1, toZone: 1 }  // Off-peak
    ]);
  
    const results = journey.getResults();
    const mondayFare = results[1].dayFare["Monday"];
  
    // Expected: 30 (peak) + 25 (off-peak) = 55
    expect(mondayFare).toBe(55);
  });
  
  it('caps fare at daily limit', () => {
    const manyTrips: JourneyDetails[] = [];
    for (var i=0; i<20; i++) {
      manyTrips.push({
        day: "Tuesday" as const,
        time: "09:00",
        fromZone: 1,
        toZone: 1
      });
    }
  
    const journey = runJourneyCalculation(manyTrips);
    const results = journey.getResults();
  
    // Zone 1-1 daily cap = 100
    expect(results[1].dayFare["Tuesday"]).toBe(100);
  });

});
