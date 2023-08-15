const Amadeus = require('amadeus');
const AmadeusFlightDTO = require('./dto/amadeusFlight.dto');

class AmadeusFlightAdapter {
  constructor() {
    this.amadeusApi = new Amadeus({
      clientId: process.env.FLIGHT_SERVICE_AMADEUS_API_ACCESSKEY,
      clientSecret: process.env.FLIGHT_SERVICE_AMADEUS_API_SECRET,
      hostname: process.env.FLIGHT_SERVICE_AMADEUS_ENV,
    });
  }
  async searchFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate) {
    try {
      const response = await this.amadeusApi.shopping.flightOffersSearch.get({
        originLocationCode: originIATA,
        destinationLocationCode: destinationIATA,
        departureDate,
        returnDate,
        adults: adultsNb,
        travelClass: 'ECONOMY',
        currencyCode: 'EUR',
        max: process.env.FLIGHT_SERVICE_AMADEUS_MAX_RESULTS,
      });
      return response.data;
    } catch (err) {
      throw new Error(JSON.stringify(err.description));
    }
  }
  adaptFlights(flightsFromApi) {
    return flightsFromApi.map(flightFromApi => new AmadeusFlightDTO(flightFromApi));
  }
}
module.exports = AmadeusFlightAdapter;
