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
    const uniquePrices = {};
    const uniqueFlights = flightsFromApi.filter(item => {
      if (!uniquePrices[item.price.total]) {
        uniquePrices[item.price.total] = true;
        return true;
      }
      return false;
    });
    return uniqueFlights.slice(0,5).map(flightFromApi => new AmadeusFlightDTO(flightFromApi));
  }
}
module.exports = AmadeusFlightAdapter;
