import { Day, Weekday, Weekend, TimeRange, Zone, JourneyDetails, weekdays, weekends } from "../types";
import { PeakAndOffPeakRules } from "../interfaces/PeakAndOffPeakRules";
import { PEAK_HOUR_SLOTS } from "../constants/peakHours";
import { timeToMinutes } from "../utils/time";
import { ZoneCosting } from "./ZoneCosting";

/**
 * JourneyFareCalculation handles fare computation for journeys
 * including peak/off-peak calculation, daily and weekly capping.
 * Extends ZoneCosting for trip costs and caps.
 * Implements PeakAndOffPeakRules to determine peak/off-peak times.
 */
export default class JourneyFareCalculation extends ZoneCosting implements PeakAndOffPeakRules {
    private journeyDay!: Day;
    private journeyTime!: number;
    private fromZone!: Zone;
    private toZone!: Zone;
    public weekWiseFare: number;
    public dayWiseFare: Partial<Record<Day, number>>;
    private currentWeek: number;
    private resultByWeek: Record<number, {weekFare: number, dayFare: Partial<Record<Day, number>> }>;
    private previousDay?: Day;

    /**
     * Initializes a new JourneyFareCalculation instance
     * calls the ZoneCosting constructor, sets initial fare values
     */
    constructor() {
        super();
        this.weekWiseFare = 0;
        this.dayWiseFare = {};
        this.currentWeek = 1;
        this.resultByWeek = {1:{weekFare: 0, dayFare: {}}};
    }

    /**
     * @returns true if day is Weekday, false otherwise
     */
    isWeekday(day: Day): day is Weekday {
        return weekdays.some(weekday => weekday === day);
    }

    /**
     * @returns true if day is Weekend, false otherwise
     */
    isWeekend(day: Day): day is Weekend {
        return weekends.some(weekend => weekend === day);
    }

    /**
     * @returns true if this.journeyTime is withing peak timings or false otherwise
     */
    private isTimePeak(): boolean {
        let slots: TimeRange[];

        if (this.isWeekday(this.journeyDay)) {
            slots = PEAK_HOUR_SLOTS.weekday_slots;
        } else {
            slots = PEAK_HOUR_SLOTS.weekend_slots;
        }

        return slots.some(slot => this.journeyTime >= timeToMinutes(slot.start) && this.journeyTime <= timeToMinutes(slot.end) );

    }

    /**
     * set initial values of journey based on the given record of type JourneyDetails
     */
    private setJourneyDetails(details: JourneyDetails): void {
        this.journeyDay = details.day;
        this.journeyTime = timeToMinutes(details.time);
        this.fromZone = details.fromZone;
        this.toZone = details.toZone;
        if (!(this.journeyDay in this.dayWiseFare)) {
            this.dayWiseFare[this.journeyDay] = 0;
        }
    }

    /**
     * get fare based on the set JourneyDetails based on cost by zones + peak/offPeak timings
     * @returns peak or offPeak cost
     */
    private getSingleJourneyFare(): number {
        const cost = this.getTripCostByZones(`${this.fromZone}-${this.toZone}`);
        //find if peak or off-peak time
        const peakTime = this.isTimePeak();
        if (peakTime) {
            return cost.peakCost;
        } else {
            return cost.offPeakCost;
        }
    }

    /*
    * check if a new week started, if yes re-initialize fare values
    */
    private checkNewWeek(day: Day) {
        if ((this.previousDay == "Sunday" && day == "Monday")) {
            this.currentWeek++;
            this.weekWiseFare = 0;
            this.dayWiseFare = {};
            this.resultByWeek[this.currentWeek] = {weekFare:0, dayFare: {}};
        }
    }

    /** 
     * fare calculation by day and week
    */
    calculateFareForTheDayandWeek(details: JourneyDetails): void {
        this.checkNewWeek(details.day);
        this.setJourneyDetails(details);
        let fare = this.getSingleJourneyFare();
        const currentDayFare = this.dayWiseFare[this.journeyDay] ?? 0;
        const costCapData = this.getZonalCostCap(`${this.fromZone}-${this.toZone}`);
        const remainingWeekly = costCapData.weekly - this.weekWiseFare;
        const remainingDaily = costCapData.daily - currentDayFare;

        fare = Math.min(fare, remainingWeekly, remainingDaily);
        
        this.dayWiseFare[this.journeyDay] = currentDayFare + fare;
        this.weekWiseFare += fare;

        this.resultByWeek[this.currentWeek].weekFare = this.weekWiseFare;
        this.resultByWeek[this.currentWeek].dayFare = {...this.dayWiseFare};
        this.previousDay = details.day;
    }

    /**
     * @returns results based on current week
     */
    getResults() {
        return this.resultByWeek;
    }
}
