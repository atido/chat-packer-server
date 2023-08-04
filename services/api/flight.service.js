const FlightDTO = require('../../dto/flight.dto');
const MongooseService = require('../mongoose.service');
const FlightModel = require('../../models/Flight.model');

class FlightService {
  constructor() {
    this.url = process.env.MOCK_FLIGHT && process.env.MOCK_FLIGHT == 'true' ? process.env.MOCK_FLIGHT_SERVICE_API_URL : process.env.FLIGHT_SERVICE_API_URL;
    this.headers = {
      'X-RapidAPI-Key': process.env.FLIGHT_SERVICE_API_ACCESSKEY,
      'X-RapidAPI-Host': process.env.FLIGHT_SERVICE_API_HOST,
    };
    this.mongooseService = new MongooseService(FlightModel);
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
        setTimeout(resolve, process.env.FLIGHT_SERVICE_WAITING_TIME);
      });
      result = await fetch(fullUrl, options);
      const resultJson = await result.json();
      const flights = resultJson.itineraries.buckets.map(itineraryFromApi => new FlightDTO(itineraryFromApi.items[0], itineraryFromApi.id));

      await Promise.all(
        flights.map(async flight => {
          const updatedFlight = await this.mongooseService.findOneAndUpdate({ apiId: flight.apiId }, flight, {
            upsert: true,
            new: true,
          });
          flight._id = updatedFlight._id;
        })
      );

      return flights;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = FlightService;
