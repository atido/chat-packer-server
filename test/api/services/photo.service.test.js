const { createApi } = require("unsplash-js");
const PhotoService = require("../../../api/services/photo.service");

jest.mock("unsplash-js", () => ({
  createApi: jest.fn(),
}));

beforeEach(() => {
  createApi.mockClear();
});

describe("PhotoService", () => {
  let photoService;
  let photoApiMock;

  beforeEach(() => {
    photoApiMock = {
      response: {
        urls: {
          small:
            "https://images.unsplash.com/photo-1598077720279-8d7232a28f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzMyMzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkzMzI0ODZ8&ixlib=rb-4.0.3&q=80&w=400",
        },
      },
    };
    const mockGetRandom = jest.fn().mockResolvedValue(photoApiMock);
    const mockPhotos = { getRandom: mockGetRandom };
    const mockCreateApi = { photos: mockPhotos };
    createApi.mockReturnValue(mockCreateApi);

    photoService = new PhotoService();
  });

  describe("getRandomPhoto", () => {
    it("should return the small photo URL from the response", async () => {
      const query = "rome";
      const expectedPhotoUrl =
        "https://images.unsplash.com/photo-1598077720279-8d7232a28f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzMyMzd8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkzMzI0ODZ8&ixlib=rb-4.0.3&q=80&w=400";

      const result = await photoService.getRandomPhoto(query);

      expect(result).toEqual({ photo: expectedPhotoUrl });
    });

    it("should throw an error if photos.getRandom throws an error", async () => {
      const query = "rome";
      const error = new Error("Some error message");
      photoService.photoApi.photos.getRandom.mockRejectedValue(error);

      await expect(photoService.getRandomPhoto(query)).rejects.toThrow(error);
    });
  });
});
