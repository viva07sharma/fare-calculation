# Myoystercard Fare Calculator

A TypeScript-based library to calculate daily and weekly journey fares with peak/off-peak rules and zone-based capping limits. The library supports multi-week journeys and ensures fare limits are respected per day and per week.

---

## Features

- Calculate fares for journeys between zones.
- Automatically detect peak and off-peak times.
- Enforce daily and weekly fare caps.
- Handle multiple journeys across days and weeks.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Testing](#testing) 
- [Usage](#usage)

---

## Requirements

- Node.js >= 22.17.0
- npm >= 10

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/viva07sharma/fare-calculation.git
cd fare-calculation
npm install
```
---

## Testing

- data folder includes test.json, test2.json and test3.json (test data on a per user basis)
- current test suite utilizes test2.json that is based more closely on the data provided in the original problem
- hit below after installation to see results

```bash
npm test
```

---

## Usage

```ts
import { JourneyDetails, UserJourneyDetails } from '../src/types';
import { runJourneyCalculation, runJourneyCalculationPerUser } from "./src/index";

const journeys: JourneyDetails[] = [
  { day: "Monday", time: "08:00", fromZone: 1, toZone: 1 },
  { day: "Monday", time: "09:00", fromZone: 1, toZone: 2 },
];

const journeyCalculator = runJourneyCalculation(journeys);
console.log(journeyCalculator.getResults());
// Example output:
// {
//   1: { weekFare: 65, dayFare: { Monday: 65 } }
// }
const journeyCalculatorPerUser = runJourneyCalculationPerUser("uid1", journeys);
console.log(journeyCalculatorPerUser.getResults());
```
