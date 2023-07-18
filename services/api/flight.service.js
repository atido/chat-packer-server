const ItineraryDTO = require("../../dto/itinerary.dto");

class FlightService {
  constructor() {
    this.url =
      process.env.MOCK && process.env.MOCK == "true"
        ? process.env.MOCK_FLIGHT_SERVICE_API_URL
        : process.env.FLIGHT_SERVICE_API_URL;
    this.headers = {
      "X-RapidAPI-Key": process.env.FLIGHT_SERVICE_API_ACCESSKEY,
      "X-RapidAPI-Host": process.env.FLIGHT_SERVICE_API_HOST,
    };
  }

  async getFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate) {
    try {
      const fullUrl = `${this.url}?${new URLSearchParams({
        adults: adultsNb,
        origin: originIATA,
        destination: destinationIATA,
        departureDate,
        returnDate,
        adults: adultsNb,
        currency: "EUR",
        market: "FR",
      })}`;
      const options = {
        method: "GET",
        headers: this.headers,
      };

      let result = await fetch(fullUrl, options);
      await new Promise((resolve) => {
        setTimeout(resolve, process.env.FLIGHT_SERVICE_WAITING_TIME);
      });
      result = await fetch(fullUrl, options);
      const resultJson = await result.json();
      return resultJson.itineraries.buckets.map(
        (itineraryFromApi) => new ItineraryDTO(itineraryFromApi)
      );
    } catch (err) {
      throw err;
    }
  }
}
module.exports = FlightService;
