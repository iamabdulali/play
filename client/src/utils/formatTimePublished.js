export function getTimeDifference(givenDateString) {
  // Parse the given date string to a Date object
  const givenDate = new Date(givenDateString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate - givenDate;

  // Define time units in milliseconds
  const millisecondsInOneDay = 24 * 60 * 60 * 1000;
  const millisecondsInOneHour = 60 * 60 * 1000;
  const millisecondsInOneMinute = 60 * 1000;
  const millisecondsInOneSecond = 1000;

  // Calculate the difference in days, hours, minutes, and seconds
  const days = Math.floor(differenceInMilliseconds / millisecondsInOneDay);
  const hours = Math.floor(differenceInMilliseconds / millisecondsInOneHour);
  const minutes = Math.floor(
    differenceInMilliseconds / millisecondsInOneMinute
  );
  const seconds = Math.floor(
    differenceInMilliseconds / millisecondsInOneSecond
  );

  // Determine the most appropriate unit to display the difference
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}
