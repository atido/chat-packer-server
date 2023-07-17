require("dotenv").config({ path: ".env.test" });
const fetchMock = require("jest-fetch-mock");

const AccomodationService = require("../../../api/services/accommodation.service");
const AccomodationDTO = require("../../../dto/accomodation.dto");

beforeAll(() => {
  global.fetch = fetchMock;
});

describe("AccomodationService", () => {
  let accomodationService;

  beforeEach(() => {
    accomodationService = new AccomodationService();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("getAccomodation", () => {
    const mockApiResponse = {
      results: [
        {
          id: 0,
          name: "Accomodation 0",
          rating: 5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        },
        {
          id: 1,
          name: "Accomodation 1",
          rating: 4.5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        },
        {
          id: 2,
          name: "Accomodation 2",
          rating: 3.8,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 116 },
        },
        {
          id: 3,
          name: "Accomodation 3",
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 126 },
        },
        {
          id: 4,
          rating: 4.2,
          name: "Accomodation 4",
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 80 },
        },
      ],
    };

    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(mockApiResponse));
    });

    it("should fetch accomodation data with correct parameters", async () => {
      const location = "Paris";
      const checkin = "2023-07-15";
      const checkout = "2023-07-20";
      const adultsNb = 2;

      await accomodationService.getAccomodations(location, checkin, checkout, adultsNb);

      const expectedUrl = `${accomodationService.url}?${new URLSearchParams({
        location,
        checkin,
        checkout,
        adults: adultsNb,
        currency: "EUR",
      })}`;
      const expectedOptions = {
        method: "GET",
        headers: accomodationService.headers,
      };

      await accomodationService.getAccomodations(location, checkin, checkout, adultsNb);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
    });

    it("should return sorted and limited accomodation DTOs", async () => {
      const location = "Paris";
      const checkin = "2023-07-15";
      const checkout = "2023-07-20";
      const adultsNb = 2;

      const result = await accomodationService.getAccomodations(
        location,
        checkin,
        checkout,
        adultsNb
      );
      console.log(result);

      expect(result).toEqual([
        new AccomodationDTO({
          id: 0,
          name: "Accomodation 0",
          rating: 5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        }),
        new AccomodationDTO({
          id: 1,
          name: "Accomodation 1",
          rating: 4.5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        }),
        new AccomodationDTO({
          id: 4,
          name: "Accomodation 4",
          rating: 4.2,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 80 },
        }),
        new AccomodationDTO({
          id: 2,
          name: "Accomodation 2",
          rating: 3.8,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 116 },
        }),
        new AccomodationDTO({
          id: 3,
          name: "Accomodation 3",
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 126 },
        }),
      ]);
    });

    it("should throw an error if the API request fails", async () => {
      const location = "Paris";
      const checkin = "2023-07-15";
      const checkout = "2023-07-20";
      const adultsNb = 2;

      const error = new Error("API request failed");
      fetch.mockRejectedValue(error);

      await expect(
        accomodationService.getAccomodations(location, checkin, checkout, adultsNb)
      ).rejects.toThrow(error);
    });
  });
});
