const { toHoursAndMinutes, extractHoursAndMinutes, extractYearMonthDay } = require("../utils/time");

class ItineraryDTO {
  constructor(itineraryFromApi) {
    this.id = itineraryFromApi.id;
    this.code = itineraryFromApi.id;
    this.flightsItems = itineraryFromApi.items
      .slice(0, 1)
      .map((itemFromApi) => new FlightItem(itemFromApi));
  }
}

class FlightItem {
  constructor(flightItemFromApi) {
    this.apiId = flightItemFromApi.id;
    this.price = {
      total: flightItemFromApi.price.raw,
      currency: flightItemFromApi.price.currency || "EUR",
    };
    this.url = flightItemFromApi.deeplink;
    this.go = new Leg(flightItemFromApi.legs[0]);
    this.back = new Leg(flightItemFromApi.legs[1]);
  }
}

class Leg {
  constructor(legFromApi) {
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
    this.departure = new AirportDate(legFromApi.departure);
    this.arrival = new AirportDate(legFromApi.arrival);
    this.stopCount = legFromApi.stopCount;
    this.duration = toHoursAndMinutes(legFromApi.durationInMinutes);
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
  constructor(id, name, displayCode, city) {
    this.code = id;
    this.name = name;
    this.city = city;
    this.displayCode = displayCode;
  }
}
module.exports = ItineraryDTO;
