const AccomodationDTO = require("../../dto/accomodation.dto");
const MongooseService = require("../mongoose.service");
const AccomodationModel = require("../../models/Accomodation.model");

class AccomodationService {
  constructor() {
    this.url =
      process.env.MOCK && process.env.MOCK == "true"
        ? process.env.MOCK_ACCOMODATION_SERVICE_API_URL
        : process.env.ACCOMODATION_SERVICE_API_URL;
    this.headers = {
      "X-RapidAPI-Key": process.env.ACCOMODATION_SERVICE_API_ACCESSKEY,
      "X-RapidAPI-Host": process.env.ACCOMODATION_SERVICE_API_HOST,
    };
    this.mongooseService = new MongooseService(AccomodationModel);
  }

  async getAccomodations(location, checkin, checkout, adultsNb) {
    try {
      const result = await fetch(
        `${this.url}?${new URLSearchParams({
          location,
          checkin,
          checkout,
          adults: adultsNb,
          currency: "EUR",
        })}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );
      const resultJson = await result.json();
      const accomodations = resultJson.results
        .sort((a, b) => {
          if (a.rating === undefined && b.rating === undefined) return 0;
          if (a.rating === undefined) return 1;
          if (b.rating === undefined) return -1;
          return b.rating - a.rating;
        })
        .slice(0, 5)
        .map((accomodationFromApi) => new AccomodationDTO(accomodationFromApi));

      await Promise.all(
        accomodations.map(async (accomodation) => {
          const updatedAccomodation = await this.mongooseService.findOneAndUpdate(
            { apiId: accomodation.apiId },
            accomodation,
            {
              upsert: true,
              new: true,
            }
          );
          accomodation._id = updatedAccomodation._id;
        })
      );

      return accomodations;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = AccomodationService;
