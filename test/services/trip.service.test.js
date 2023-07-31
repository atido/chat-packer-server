const MongooseService = require("../../services/mongoose.service");
const PhotoService = require("../../services/api/photo.service");
const TripService = require("../../services/trip.service");
const mockFlight = require("./data/flightItem.json");
const mockTrips = require("./data/trips.json");
const mockTrip = require("./data/trip.json");
const mockAccommodation = require("./data/accommodation.json");

jest.mock("../../services/mongoose.service");
jest.mock("../../services/api/photo.service");

describe("TripService", () => {
  let tripService;

  beforeEach(() => {
    tripService = new TripService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUserId = "user123";
  const mockTripInfo = {
    departureCity: "Paris",
    destinationCity: "Mahe",
    departureDate: "2023-11-22",
    returnDate: "2023-11-30",
  };
  const mockPhoto = { photo: "https://example.com/photo.jpg" };

  beforeEach(() => {
    tripService = new TripService();
    MongooseService.mockClear();
    PhotoService.mockClear();
  });

  describe("getTripById", () => {
    it("should call mongooseService.findOne with correct id : user and trip", async () => {
      const mockTripId = "trip123";
      const mockUserId = "user123";

      await tripService.getTripById(mockTripId, mockUserId);

      expect(MongooseService.prototype.findOne).toHaveBeenCalledWith(mockTripId, mockUserId);
    });

    it("should call mongooseService.findById and return mock trip", async () => {
      const mockTripId = "trip123";
      MongooseService.prototype.findById.mockResolvedValue(mockTrip);

      const result = await tripService.getTripById(mockTripId);

      expect(result).toEqual(mockTrip);
    });

    it("should throw an error if mongooseService.findById throws an error", async () => {
      const mockTripId = "trip123";
      const mockError = new Error("Failed to find a trip");
      MongooseService.prototype.findById.mockRejectedValue(mockError);

      await expect(tripService.getTripById(mockTripId)).rejects.toThrow(mockError);
    });
  });

  describe("getTripsByUserId", () => {
    it("should call mongooseService.find with correct userId", async () => {
      await tripService.getTripsByUserId(mockUserId);

      expect(MongooseService.prototype.find).toHaveBeenCalledWith({ userId: mockUserId });
    });

    it("should call mongooseService.find and return mock trip", async () => {
      MongooseService.prototype.find.mockResolvedValue(mockTrips);

      const result = await tripService.getTripsByUserId(mockUserId);

      expect(result).toEqual(mockTrips);
    });

    it("should throw an error if mongooseService.find throws an error", async () => {
      const mockError = new Error("Failed to find a trip");
      MongooseService.prototype.find.mockRejectedValue(mockError);

      await expect(tripService.getTripsByUserId(mockUserId)).rejects.toThrow(mockError);
    });
  });

  describe("createTrip", () => {
    it("should call photoService.getRandomPhoto with correct destinationCity", async () => {
      PhotoService.prototype.getRandomPhoto.mockResolvedValue(mockPhoto);
      await tripService.createTrip(mockUserId, mockTripInfo, mockFlight, mockAccommodation);

      expect(PhotoService.prototype.getRandomPhoto).toHaveBeenCalledWith(
        mockTripInfo.destinationCity
      );
    });

    it("should call mongooseService.create with correct trip data", async () => {
      await tripService.createTrip(mockUserId, mockTripInfo, mockFlight, mockAccommodation);

      const expectedTripData = {
        userId: mockUserId,
        tripInfo: mockTripInfo,
        flight: mockFlight,
        accommodation: mockAccommodation,
        destinationPhoto: mockPhoto.photo,
      };
      expect(MongooseService.prototype.create).toHaveBeenCalledWith(expectedTripData);
    });

    it("should throw an error if photoService.getRandomPhoto throws an error", async () => {
      const mockError = new Error("Failed to get random photo");
      PhotoService.prototype.getRandomPhoto.mockRejectedValue(mockError);

      await expect(
        tripService.createTrip(mockUserId, mockTripInfo, mockFlight, mockAccommodation)
      ).rejects.toThrow(mockError);
    });

    it("should return the created trip data", async () => {
      PhotoService.prototype.getRandomPhoto.mockResolvedValue(mockPhoto);
      MongooseService.prototype.create.mockResolvedValue(mockTrip);

      const result = await tripService.createTrip(
        mockUserId,
        mockTripInfo,
        mockFlight,
        mockAccommodation
      );

      expect(result).toEqual(mockTrip);
    });

    it("should throw an error if mongooseService.create throws an error", async () => {
      const mockError = new Error("Failed to create trip");
      MongooseService.prototype.create.mockRejectedValue(mockError);

      await expect(
        tripService.createTrip(mockUserId, mockTripInfo, mockFlight, mockAccommodation)
      ).rejects.toThrow(mockError);
    });
  });
});
