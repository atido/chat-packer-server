function toHoursAndMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

function extractHoursAndMinutes(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function extractYearMonthDay(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDurationISO8601(durationString) {
  return durationString.replace(/PT(\d+)H(?:(\d+)M)?/, (_, hours, minutes) => {
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes ? minutes.padStart(2, '0') : '00';
    return `${formattedHours}h${formattedMinutes}`;
  });
}

module.exports = { parseDurationISO8601, toHoursAndMinutes, extractHoursAndMinutes, extractYearMonthDay };
