function buildJourneys(zs: readonly Zone[]): JourneyPath[] {
    const paths: JourneyPath[] = [];
    for (const from of zs) {
      for (const to of zs) {
        paths.push([from, to]);
      }
    }
    return paths;
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 60) + minutes;
}  

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const weekends = ["Saturday", "Sunday"] as const;

type Weekday = typeof weekdays[number];
type Weekend = typeof weekends[number];
type Day = Weekday | Weekend;
type TimeRange = { start: string; end: string; };

const zones = [1, 2] as const;
type ZoneKey = `${Zone}-${Zone}`;
type Zone = typeof zones[number];
type JourneyPath = [Zone, Zone];
const validJourneys = buildJourneys(zones);

type ZoneCost = { peakCost: number; offPeakCost: number; };
type CostCap = {daily: number; weekly: number;}
type TripCost = Record<ZoneKey, ZoneCost>;
type ZonalCappingLimits = Record<ZoneKey, CostCap>;
type JourneyDetails = {
    day: Day;
    time: string;
    fromZone: Zone;
    toZone: Zone;
};

type HourSlots = { weekday_slots: TimeRange[]; weekend_slots: TimeRange[] };
const PEAK_HOUR_SLOTS: HourSlots = {
    weekday_slots: [{ start: "07:00", end: "10:30" }, { start: "17:00", end: "20:00" }],
    weekend_slots: [{ start: "09:00", end: "11:00" }, { start: "18:00", end: "22:00" }]
} as const;
interface PeakAndOffPeakRules {
    isWeekday(day: Day): day is Weekday;
    isWeekend(day: Day): day is Weekend;
}

class ZoneCosting {
    private tripCostByZones: TripCost;
    private zonalCostCap: ZonalCappingLimits;

    constructor() {
        this.tripCostByZones = {
            "1-1": { peakCost: 30, offPeakCost: 25 },
            "1-2": { peakCost: 35, offPeakCost: 30 },
            "2-1": { peakCost: 35, offPeakCost: 30 },
            "2-2": { peakCost: 25, offPeakCost: 20 }
        };

        this.zonalCostCap = {
            "1-1": {daily: 100, weekly: 500},
            "1-2": {daily: 120, weekly: 600},
            "2-1": {daily: 120, weekly: 600},
            "2-2": {daily: 80, weekly: 400}
        }
    }

    protected getTripCostByZones(zoneKey: ZoneKey): ZoneCost {
        return this.tripCostByZones[zoneKey];
    }

    protected getZonalCostCap(zoneKey: ZoneKey): CostCap {
        return this.zonalCostCap[zoneKey];
    }
}

class JourneyFareCalculation extends ZoneCosting implements PeakAndOffPeakRules {
    private journeyDay!: Day;
    private journeyTime!: number;
    private fromZone!: Zone;
    private toZone!: Zone;
    private weekWiseFare: number;
    public dayWiseFare: Partial<Record<Day, number>>;

    constructor() {
        super();
        this.weekWiseFare = 0;
        this.dayWiseFare = {};
    }

    isWeekday(day: Day): day is Weekday {
        return weekdays.some(weekday => weekday === day);
    }

    isWeekend(day: Day): day is Weekend {
        return weekends.some(weekend => weekend === day);
    }

    isTimePeak(): boolean {
        let slots: TimeRange[];

        if (this.isWeekday(this.journeyDay)) {
            slots = PEAK_HOUR_SLOTS.weekday_slots;
        } else {
            slots = PEAK_HOUR_SLOTS.weekend_slots;
        }

        return slots.some(slot => this.journeyTime >= timeToMinutes(slot.start) && this.journeyTime <= timeToMinutes(slot.end) );

    }

    setJourneyDetails(details: JourneyDetails): void {
        this.journeyDay = details.day;
        this.journeyTime = timeToMinutes(details.time);
        this.fromZone = details.fromZone;
        this.toZone = details.toZone;
        if (!(this.journeyDay in this.dayWiseFare)) {
            this.dayWiseFare[this.journeyDay] = 0;
        }
    }

    getSingleJourneyFare(): number {
        const cost = this.getTripCostByZones(`${this.fromZone}-${this.toZone}`);
        //find if peak or off-peak time
        const peakTime = this.isTimePeak();
        if (peakTime) {
            return cost.peakCost;
        } else {
            return cost.offPeakCost;
        }
    }

    calculateFareForTheDay(details: JourneyDetails): void {
        this.setJourneyDetails(details);
        let fare = this.getSingleJourneyFare();
        const currentDayFare = this.dayWiseFare[this.journeyDay] ?? 0;
        const costCapData = this.getZonalCostCap(`${this.fromZone}-${this.toZone}`);
        const remainingWeekly = costCapData.weekly - this.weekWiseFare;
        const remainingDaily = costCapData.daily - currentDayFare;

        fare = Math.min(fare, remainingWeekly, remainingDaily);
        
        this.dayWiseFare[this.journeyDay] = currentDayFare + fare;
        this.weekWiseFare += fare;
    }
}


let userData: JourneyDetails[] = [
    {
        "day": "Monday",
        "time": "10:20",
        "fromZone": 2,
        "toZone": 1
    }
]; //data from file
const journey = new JourneyFareCalculation();

userData.map((row) => {
    journey.calculateFareForTheDay(row);
});

const allDays: Day[] = [...weekdays, ...weekends];
for (const d of allDays) {
    console.log(`Day fare for ${d}: ${journey.dayWiseFare[d] ?? 0}\n`);
}