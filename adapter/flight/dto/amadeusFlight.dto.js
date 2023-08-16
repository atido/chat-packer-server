const { parseDurationISO8601, extractYearMonthDay } = require('../../../utils/time');
const { AirportDate, Airport } = require('./commonFlight.dto');

class AmadeusFlightDTO {
  constructor(flightItemFromApi) {
    const firstItinerary = flightItemFromApi.itineraries[0];
    const lastSegmentFirstItinerary = firstItinerary.segments[firstItinerary.segments.length - 1];
    const firstSegmentFirstItinerary = firstItinerary.segments[0];

    const secondItinerary = flightItemFromApi.itineraries[1];
    const lastSegmentSecondItinerary = secondItinerary.segments[secondItinerary.segments.length - 1];

    this.apiId = `${extractYearMonthDay(firstSegmentFirstItinerary.departure.at)}-${extractYearMonthDay(lastSegmentSecondItinerary.arrival.at)}-${firstItinerary.duration}-${
      secondItinerary.duration
    }-${firstSegmentFirstItinerary.carrierCode}-${firstSegmentFirstItinerary.departure.iataCode}-${lastSegmentFirstItinerary.arrival.iataCode}-${firstSegmentFirstItinerary.number}-${
      lastSegmentSecondItinerary.number
    }`;
    this.price = {
      total: flightItemFromApi.price.total,
      currency: flightItemFromApi.price.currency || 'EUR',
    };
    this.url = '';
    this.go = new Leg(firstItinerary);
    this.back = new Leg(secondItinerary);
  }
}

class Leg {
  constructor(legFromApi) {
    this.origin = new Airport(legFromApi.segments[0].departure.iataCode, legFromApi.segments[0].departure.iataCode, legFromApi.segments[0].departure.iataCode);
    this.destination = new Airport(
      legFromApi.segments[legFromApi.segments.length - 1].arrival.iataCode,
      legFromApi.segments[legFromApi.segments.length - 1].arrival.iataCode,
      legFromApi.segments[legFromApi.segments.length - 1].arrival.iataCode
    );
    this.departure = new AirportDate(legFromApi.segments[0].departure.at);
    this.arrival = new AirportDate(legFromApi.segments[legFromApi.segments.length - 1].arrival.at);
    this.stopCount = legFromApi.segments.length - 1;
    this.duration = parseDurationISO8601(legFromApi.duration);
    this.carrierLogo = `https://www.skyscanner.net/images/airlines/favicon/${legFromApi.segments[0].carrierCode}.png`; //TODO - handle default pic
  }
}
module.exports = AmadeusFlightDTO;
