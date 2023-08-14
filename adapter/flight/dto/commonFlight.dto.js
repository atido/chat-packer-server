const { extractHoursAndMinutes, extractYearMonthDay } = require('../../../utils/time');
class AirportDate {
  constructor(date) {
    this.time = extractHoursAndMinutes(date);
    this.date = extractYearMonthDay(date);
  }
}
class Airport {
  constructor(name, displayCode, city) {
    this.name = name;
    this.displayCode = displayCode;
    this.city = city;
  }
}
module.exports = { AirportDate, Airport };
