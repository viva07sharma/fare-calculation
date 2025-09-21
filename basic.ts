
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const weekends = ["Saturday", "Sunday"] as const;

type Weekday = typeof weekdays[number];
type Weekend = typeof weekends[number];
type Day = Weekday | Weekend;

type timeSlots = {"start": string; "end":string; }
type PeakHoursProps = {
weekday_slots:  timeSlots[],
weekend_slots: timeSlots[]
}

const PeakHours: PeakHoursProps = {
    weekday_slots: [{"start": "07:00", "end": "10:30"}, {"start": "17:00", "end": "20:00"}], 
    weekend_slots: [{"start": "09:00", "end": "11:00"},{"start": "18:00", "end": "22:00"}] 
};
