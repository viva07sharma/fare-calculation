import { ZoneKey, ZoneCost, TripCost, CostCap, ZonalCappingLimits } from "../types";

/**
 * ZoneCosting class holds fare costs and capping rules for different zones
 * tripCostByZones: stores peak and off-peak costs for each zone combination
 * zonalCostCap: stores daily and weekly fare caps for each zone combination
 */
export abstract class ZoneCosting {
    private tripCostByZones: TripCost;
    private zonalCostCap: ZonalCappingLimits;

    /**
     * Initialize trip costs and capping limits for all zone combinations
     */
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

    /**
     * Get peak/off-peak trip cost for a given zone combination
     * @param zoneKey The zone combination key (e.g., "1-2")
     * @returns ZoneCost object with peakCost and offPeakCost
     */
    protected getTripCostByZones(zoneKey: ZoneKey): ZoneCost {
        return this.tripCostByZones[zoneKey];
    }

    /**
     * Get daily and weekly fare caps for a given zone combination
     * @param zoneKey The zone combination key (e.g., "1-1")
     * @returns CostCap object with daily and weekly limits
     */
    protected getZonalCostCap(zoneKey: ZoneKey): CostCap {
        return this.zonalCostCap[zoneKey];
    }
}
