const { toHoursAndMinutes, extractHoursAndMinutes, extractYearMonthDay } = require("../utils/time");

class ItineraryDTO {
  constructor(itineraryFromApi) {
    this.id = itineraryFromApi.id;
    this.flightsItems = itineraryFromApi.items
      .slice(0, 1)
      .map((itemFromApi) => new FlightItem(itemFromApi));
  }
}

class FlightItem {
  constructor(flightItemFromApi) {
    this.id = flightItemFromApi.id;
    this.price = flightItemFromApi.price.raw;
    this.deeplink = flightItemFromApi.deeplink;
    this.legs = flightItemFromApi.legs.map((legFromApi) => new Leg(legFromApi));
  }
}

class Leg {
  constructor(legFromApi) {
    this.id = legFromApi.id;
    this.origin = new Airport(
      legFromApi.origin.id,
      legFromApi.origin.name,
      legFromApi.origin.displayCode
    );
    this.destination = new Airport(
      legFromApi.destination.id,
      legFromApi.destination.name,
      legFromApi.destination.displayCode
    );
    this.stopCount = legFromApi.stopCount;
    this.duration = toHoursAndMinutes(legFromApi.durationInMinutes);
    this.departure = new AirportDate(legFromApi.departure);
    this.arrival = new AirportDate(legFromApi.arrival);
    this.carrierLogo = legFromApi.carriers.marketing[0].logoUrl;
  }
}
class AirportDate {
  constructor(dateFromApi) {
    this.time = extractHoursAndMinutes(dateFromApi);
    this.date = extractYearMonthDay(dateFromApi);
  }
}
class Airport {
  constructor(id, name, displayCode) {
    this.id = id;
    this.name = name;
    this.displayCode = displayCode;
  }
}
module.exports = ItineraryDTO;
