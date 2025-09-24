/**
 * Convert given time string in "HH:MM" format to total minutes
 * @param time value (e.g. "07:00")
 * @returns total minutes
 */
export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 60) + minutes;
}