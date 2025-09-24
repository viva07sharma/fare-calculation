import { ZoneKey, ZoneCost, TripCost, CostCap, ZonalCappingLimits } from "../types";

export class ZoneCosting {
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
