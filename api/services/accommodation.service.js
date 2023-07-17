const AccomodationDTO = require("../../dto/accomodation.dto");

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
      return resultJson.results
        .sort((a, b) => {
          if (a.rating === undefined && b.rating === undefined) return 0;
          if (a.rating === undefined) return 1;
          if (b.rating === undefined) return -1;
          return b.rating - a.rating;
        })
        .slice(0, 5)
        .map((accomodationFromApi) => new AccomodationDTO(accomodationFromApi));
    } catch (err) {
      throw err;
    }
  }
}
module.exports = AccomodationService;
