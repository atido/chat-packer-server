const MongooseService = require('../mongoose.service');
const FlightModel = require('../../models/Flight.model');
const SkyscannerFlightAdapter = require('../../adapter/flight/skyscannerFlight.adapter');
const AmadeusFlightAdapter = require('../../adapter/flight/amadeusFlight.adapter');

class FlightService {
  constructor() {
    //this.flightApiAdapter = new SkyscannerFlightAdapter();
    this.flightApiAdapter = new AmadeusFlightAdapter();
    this.mongooseService = new MongooseService(FlightModel);
  }

  async searchFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate) {
    try {
      const flightsFromApi = await this.flightApiAdapter.searchFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate);
      const flights = this.flightApiAdapter.adaptFlights(flightsFromApi);

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
