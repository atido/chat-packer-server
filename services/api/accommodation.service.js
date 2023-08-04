const AccommodationDTO = require('../../dto/accommodation.dto');
const MongooseService = require('../mongoose.service');
const AccommodationModel = require('../../models/Accommodation.model');

class AccommodationService {
  constructor() {
    this.url = process.env.MOCK_ACCOMMODATION && process.env.MOCK_ACCOMMODATION == 'true' ? process.env.MOCK_ACCOMMODATION_SERVICE_API_URL : process.env.ACCOMMODATION_SERVICE_API_URL;
    this.headers = {
      'X-RapidAPI-Key': process.env.ACCOMMODATION_SERVICE_API_ACCESSKEY,
      'X-RapidAPI-Host': process.env.ACCOMMODATION_SERVICE_API_HOST,
    };
    this.mongooseService = new MongooseService(AccommodationModel);
  }

  async searchAccommodations(location, checkin, checkout, adultsNb) {
    try {
      const result = await fetch(
        `${this.url}?${new URLSearchParams({
          location,
          checkin,
          checkout,
          adults: adultsNb,
          currency: 'EUR',
        })}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );
      const resultJson = await result.json();
      const accommodations = resultJson.results
        .sort((a, b) => {
          if (a.rating === undefined && b.rating === undefined) return 0;
          if (a.rating === undefined) return 1;
          if (b.rating === undefined) return -1;
          return b.rating - a.rating;
        })
        .slice(0, 5)
        .map(accommodationFromApi => new AccommodationDTO(accommodationFromApi));

      await Promise.all(
        accommodations.map(async accommodation => {
          const updatedAccommodation = await this.mongooseService.findOneAndUpdate({ apiId: accommodation.apiId }, accommodation, {
            upsert: true,
            new: true,
          });
          accommodation._id = updatedAccommodation._id;
        })
      );

      return accommodations;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = AccommodationService;
