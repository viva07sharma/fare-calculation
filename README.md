# Myoystercard Fare Calculator

A TypeScript-based library to calculate daily and weekly journey fares with peak/off-peak rules and zone-based capping limits. The library supports multi-week journeys and ensures fare limits are respected per day and per week.

---

## Features

- Calculate fares for journeys between zones.
- Automatically detect peak and off-peak times.
- Enforce daily and weekly fare caps.
- Handle multiple journeys across days and weeks.

## Table of Contents

- [Installation](#installation)
- [Testing](#testing) 
- [Usage](#usage)

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

- data folder includes test.json and test2.json
- current test suite utilizes test2.json that is based more closely on the data provided in the original problem
- hit below after installation to see results

```bash
npm test
```

---

## Usage

```ts
import { runJourneyCalculation, JourneyDetails } from "./src/index";

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
```
