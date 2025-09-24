import fs from 'fs';
import path from 'path';
import { JourneyDetails, UserJourneyDetails } from '../src/types';
import { runJourneyCalculation, runJourneyCalculationPerUser } from '../src/index';

/**
 * Load test json and define testData as array of JourneyDetails
 */
const filePath = path.join(__dirname, '../data/test2.json');
const testData: JourneyDetails[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const filePathUser = path.join(__dirname, '../data/test3.json');
const testDataUser: UserJourneyDetails = JSON.parse(fs.readFileSync(filePathUser, 'utf-8'));

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

  it('caps fare at daily limit using test data file (data/test2.json)', () => {
    const journey = runJourneyCalculation(testData);
    const results = journey.getResults();
    console.log(`Weekly fare calculation is:\n${JSON.stringify(results, null, 2)}`);

    // week 1 is the first Monday-Sunday block in testData
    const week1Results = results[1];

    // check daily fares for specific days
    expect(week1Results.dayFare["Monday"]).toBeLessThanOrEqual(120); // zone 1-2 daily cap
    expect(week1Results.dayFare["Tuesday"]).toBeLessThanOrEqual(120); // zone 1-2 daily cap
  });

  it('caps fare at weekly limit using test data', () => {
    const journey = runJourneyCalculation(testData);
    const results = journey.getResults();
    console.log(`Weekly fare calculation is:\n${JSON.stringify(results, null, 2)}`);

    // week 1 is the first Monday-Sunday block in testData
    const week1Results = results[1];

    // Zone 1-1 weekly cap = 500, Zone 1-2 weekly cap = 600, Zone 2-1 = 600, 2-2 = 400
    const maxWeeklyCap = 600; // maximum of all zones in week 1
    expect(week1Results.weekFare).toBeLessThanOrEqual(maxWeeklyCap);
  });

});

describe('UserJourneyFareCalculation', () => {
  it('charges peak fare within peak slots and off-peak fare otherwise for a user', () => {
    const journey = runJourneyCalculationPerUser("uid1", [
      { day: "Monday", time: "08:00", fromZone: 1, toZone: 1 }, // Peak
      { day: "Monday", time: "11:30", fromZone: 1, toZone: 1 }  // Off-peak
    ]);
  
    const results = journey.getResults();
    const mondayFare = results[1].dayFare["Monday"];
  
    // Expected: 30 (peak) + 25 (off-peak) = 55
    expect(mondayFare).toBe(55);
  });
  
  it('caps fare at daily limit per user using test data file (data/test3.json)', () => {
    for (const userId in testDataUser) {
      const journey = runJourneyCalculationPerUser(userId, testDataUser[userId]);
      const results = journey.getResults();

      // week 1 is the first Monday-Sunday block in testData
      const week1Results = results[1];

      // check daily fares for specific days
      expect(week1Results.dayFare["Monday"]).toBeLessThanOrEqual(120); // zone 1-2 daily cap
      expect(week1Results.dayFare["Tuesday"]).toBeLessThanOrEqual(120); // zone 1-2 daily cap
    }
  });
});
