require("dotenv").config({ path: ".env.test" });
const fetchMock = require("jest-fetch-mock");

const AccommodationService = require("../../../services/api/accommodation.service");
const AccommodationDTO = require("../../../dto/accommodation.dto");

beforeAll(() => {
  global.fetch = fetchMock;
});

describe("AccommodationService", () => {
  let accommodationService;

  beforeEach(() => {
    accommodationService = new AccommodationService();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("getAccommodation", () => {
    const mockApiResponse = {
      results: [
        {
          id: 0,
          name: "Accommodation 0",
          rating: 5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        },
        {
          id: 1,
          name: "Accommodation 1",
          rating: 4.5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        },
        {
          id: 2,
          name: "Accommodation 2",
          rating: 3.8,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 116 },
        },
        {
          id: 3,
          name: "Accommodation 3",
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 126 },
        },
        {
          id: 4,
          rating: 4.2,
          name: "Accommodation 4",
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 80 },
        },
      ],
    };

    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(mockApiResponse));
    });

    it("should fetch accommodation data with correct parameters", async () => {
      const location = "Paris";
      const checkin = "2023-07-15";
      const checkout = "2023-07-20";
      const adultsNb = 2;

      await accommodationService.searchAccommodations(location, checkin, checkout, adultsNb);

      const expectedUrl = `${accommodationService.url}?${new URLSearchParams({
        location,
        checkin,
        checkout,
        adults: adultsNb,
        currency: "EUR",
      })}`;
      const expectedOptions = {
        method: "GET",
        headers: accommodationService.headers,
      };

      await accommodationService.searchAccommodations(location, checkin, checkout, adultsNb);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
    });

    it("should return sorted and limited accommodation DTOs", async () => {
      const location = "Paris";
      const checkin = "2023-07-15";
      const checkout = "2023-07-20";
      const adultsNb = 2;

      const result = await accommodationService.searchAccommodations(
        location,
        checkin,
        checkout,
        adultsNb
      );

      expect(result).toEqual([
        new AccommodationDTO({
          id: 0,
          name: "Accommodation 0",
          rating: 5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        }),
        new AccommodationDTO({
          id: 1,
          name: "Accommodation 1",
          rating: 4.5,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 96 },
        }),
        new AccommodationDTO({
          id: 4,
          name: "Accommodation 4",
          rating: 4.2,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 80 },
        }),
        new AccommodationDTO({
          id: 2,
          name: "Accommodation 2",
          rating: 3.8,
          images: ["imageUrl1", "imageUrl2"],
          price: { total: 116 },
        }),
        new AccommodationDTO({
          id: 3,
          name: "Accommodation 3",
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
        accommodationService.searchAccommodations(location, checkin, checkout, adultsNb)
      ).rejects.toThrow(error);
    });
  });
});
