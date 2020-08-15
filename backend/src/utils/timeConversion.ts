export default function convertHourToMinutes(time: string) {
  const [hours, minutes] = time.split(":");
  const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
  return timeInMinutes;
}

export function convertMinutesToHour(minutes: number) {
  const min = minutes % 60;
  const hours = Math.floor(minutes / 60);
  return `${hours}:${min < 10 ? "0" + min : min}`;
}
