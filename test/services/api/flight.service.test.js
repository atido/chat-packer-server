const FlightService = require("../../../services/api/flight.service");
const fetchMock = require("jest-fetch-mock");
const mockApiResponse = require("./flightDataInput.json");
const expectedOutput = require("./flightDataOutput.json");

beforeAll(() => {
  global.fetch = fetchMock;
});

describe("FlightService", () => {
  let flightService;

  beforeEach(() => {
    flightService = new FlightService();
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  describe("getFlights", () => {
    beforeEach(() => {
      fetch.mockResponse(JSON.stringify(mockApiResponse));
    });

    it("should fetch flight data with correct parameters", async () => {
      const adultsNb = 2;
      const originIATA = "JFK";
      const destinationIATA = "LAX";
      const departureDate = "2023-07-15";
      const returnDate = "2023-07-20";

      const expectedUrl = `${flightService.url}?${new URLSearchParams({
        adults: adultsNb,
        origin: originIATA,
        destination: destinationIATA,
        departureDate,
        returnDate,
        currency: "EUR",
        market: "FR",
      })}`;
      const expectedOptions = {
        method: "GET",
        headers: flightService.headers,
      };

      await flightService.getFlights(
        adultsNb,
        originIATA,
        destinationIATA,
        departureDate,
        returnDate
      );

      expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
    });

    it("should return an array of ItineraryDTOs", async () => {
      const adultsNb = 2;
      const originIATA = "JFK";
      const destinationIATA = "LAX";
      const departureDate = "2023-07-15";
      const returnDate = "2023-07-20";

      const result = await flightService.getFlights(
        adultsNb,
        originIATA,
        destinationIATA,
        departureDate,
        returnDate
      );

      expect(result).toEqual(expectedOutput);
    });

    it("should throw an error if the API request fails", async () => {
      const adultsNb = 2;
      const originIATA = "JFK";
      const destinationIATA = "LAX";
      const departureDate = "2023-07-15";
      const returnDate = "2023-07-20";

      const error = new Error("API request failed");
      fetch.mockRejectedValue(error);

      await expect(
        flightService.getFlights(adultsNb, originIATA, destinationIATA, departureDate, returnDate)
      ).rejects.toThrow(error);
    });
  });
});
