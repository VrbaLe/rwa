export const WEEK_DAYS = [
  { value: 1, label: 'Pon' },
  { value: 2, label: 'Uto' },
  { value: 3, label: 'Sre' },
  { value: 4, label: 'Čet' },
  { value: 5, label: 'Pet' },
  { value: 6, label: 'Sub' },
  { value: 7, label: 'Ned' }
];

export function formatWorkingDays(workingDays: string): string {
  const days = (workingDays ?? '').split(',').map(Number);
  return WEEK_DAYS.filter(day => days.includes(day.value)).map(day => day.label).join(', ');
}

export function isWorkingDay(date: string, workingDays: string): boolean {
  const day = new Date(`${date}T12:00:00`).getDay();
  const isoDay = day === 0 ? 7 : day;
  return (workingDays ?? '').split(',').map(Number).includes(isoDay);
}

export function generateTimeSlots(openTime: string, closeTime: string, stepMinutes = 30): string[] {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const pad = (value: number): string => String(value).padStart(2, '0');

  const slots: string[] = [];
  for (let t = toMinutes(openTime); t + stepMinutes <= toMinutes(closeTime); t += stepMinutes) {
    slots.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return slots;
}