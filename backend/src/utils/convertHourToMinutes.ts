export default function convertHourToMinutes(time:string){
    const [hours, minutes] = time.split(':');
    const timeInMinutes = (parseInt(hours) * 60) + parseInt(minutes);
    return timeInMinutes;
}