const { toHoursAndMinutes, extractHoursAndMinutes, extractYearMonthDay } = require('../../../utils/time');
const { AirportDate, Airport } = require('./commonFlight.dto');

class SkyscannerFlightDTO {
  constructor(flightItemFromApi, itineraryType) {
    this.apiId = flightItemFromApi.id;
    this.type = itineraryType;
    this.price = {
      total: flightItemFromApi.price.raw,
      currency: flightItemFromApi.price.currency || 'EUR',
    };
    this.url = flightItemFromApi.deeplink;
    this.go = new Leg(flightItemFromApi.legs[0]);
    this.back = new Leg(flightItemFromApi.legs[1]);
  }
}

class Leg {
  constructor(legFromApi) {
    this.origin = new Airport(legFromApi.origin.name, legFromApi.origin.displayCode, legFromApi.origin.city);
    this.destination = new Airport(legFromApi.destination.id, legFromApi.destination.name, legFromApi.destination.displayCode);
    this.departure = new AirportDate(legFromApi.departure);
    this.arrival = new AirportDate(legFromApi.arrival);
    this.stopCount = legFromApi.stopCount;
    this.duration = toHoursAndMinutes(legFromApi.durationInMinutes);
    this.carrierLogo = legFromApi.carriers.marketing[0].logoUrl;
  }
}

module.exports = SkyscannerFlightDTO;
