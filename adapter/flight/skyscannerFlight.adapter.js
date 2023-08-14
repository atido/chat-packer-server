const SkyscannerFlightDTO = require('./dto/skscannerFlight.dto');

class SkyscannerFlightAdapter {
  constructor() {
    this.url = process.env.MOCK_FLIGHT && process.env.MOCK_FLIGHT == 'true' ? process.env.MOCK_FLIGHT_SKYSCANNER_SERVICE_API_URL : process.env.FLIGHT_SERVICE_SKYSCANNER_API_URL;
    this.headers = {
      'X-RapidAPI-Key': process.env.FLIGHT_SKYSCANNER_SERVICE_API_ACCESSKEY,
      'X-RapidAPI-Host': process.env.FLIGHT_SKYSCANNER_SERVICE_API_HOST,
    };
  }
  async searchFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate) {
    try {
      const fullUrl = `${this.url}?${new URLSearchParams({
        adults: adultsNb,
        origin: originIATA,
        destination: destinationIATA,
        departureDate,
        returnDate,
        adults: adultsNb,
        currency: 'EUR',
        market: 'FR',
      })}`;
      const options = {
        method: 'GET',
        headers: this.headers,
      };
      let result = await fetch(fullUrl, options);
      await new Promise(resolve => {
        setTimeout(resolve, process.env.FLIGHT_SERVICE_SKYSCANNER_WAITING_TIME);
      });
      result = await fetch(fullUrl, options);
      return await result.json();
    } catch (err) {
      throw err;
    }
  }

  adaptFlights(jsonFlightsFromApi) {
    return jsonFlightsFromApi.itineraries.buckets.map(itineraryFromApi => new SkyscannerFlightDTO(itineraryFromApi.items[0], itineraryFromApi.id));
  }
}
module.exports = SkyscannerFlightAdapter;
