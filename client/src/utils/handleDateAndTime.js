export function handleTimeAndDate(timestamp) {
  const date = new Date(timestamp);

  // Extracting time components
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // Determining AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Converting to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 12-hour clock with 0 as 12

  // Formatting hours, minutes, and seconds to have leading zeros if necessary
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Constructing the time string
  const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

  console.log(timeString); // Output: 05:19:46 AM
  return timeString;
}
