export function formatDuration(duration) {
  // Convert duration to an integer (whole seconds) and get fractional part
  let totalSeconds = Math.floor(duration);

  // Calculate hours, minutes, and remaining seconds
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Format minutes and seconds to be always two digits
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  // Combine them into the desired format
  if (hours > 0) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}
