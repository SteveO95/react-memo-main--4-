export function serializeTrackTime(time) {
  let seconds;
  let minutes;

  seconds = parseInt(time);
  minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return addLeadingZero(minutes) + ":" + addLeadingZero(seconds);
}

function addLeadingZero(time) {
  return time <= 9 ? `0${time}` : String(time);
}
