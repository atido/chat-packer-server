const UserService = require("../../services/user.service");
const MongooseService = require("../../services/mongoose.service");
let userService = null;

jest.mock("../../services/mongoose.service");

beforeAll(() => {
  userService = new UserService();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UserService", () => {
  describe("create userService instance", () => {
    test("userService to be defined", () => {
      expect(userService).toBeDefined();
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userToCreate = {
        email: "john.doe@example.com",
        password: "password123",
        username: "johndoe",
      };
      const createdUser = { _id: "123", ...userToCreate };
      MongooseService.prototype.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(
        userToCreate.email,
        userToCreate.password,
        userToCreate.username
      );

      expect(MongooseService.prototype.create).toHaveBeenCalledWith(userToCreate);
      expect(result).toEqual(createdUser);
    });

    it("should throw an error if there is an error creating a user", async () => {
      const userToCreate = {
        email: "john.doe@example.com",
        password: "password123",
        username: "johndoe",
      };
      const error = new Error("Something went wrong");
      MongooseService.prototype.create.mockRejectedValue(error);

      await expect(
        userService.createUser(userToCreate.email, userToCreate.password, userToCreate.username)
      ).rejects.toThrow(error);
    });
  });

  describe("getUserByEmail", () => {
    it("should find a user", async () => {
      const query = { email: "john.doe@example.com" };
      const foundUser = {
        _id: "123",
        email: "john.doe@example.com",
        password: "password123",
        username: "johndoe",
      };
      MongooseService.prototype.findOne.mockResolvedValue(foundUser);

      const result = await userService.getUserByEmail(query.email);

      expect(MongooseService.prototype.findOne).toHaveBeenCalledWith(query);
      expect(result).toEqual(foundUser);
    });

    it("should throw an error if there is an error finding a user", async () => {
      const email = "john.doe@example.com";
      const error = new Error("Something went wrong");
      MongooseService.prototype.findOne.mockRejectedValue(error);

      await expect(userService.getUserByEmail(email)).rejects.toThrow(error);
    });
  });

  describe("checkIfUserExist", () => {
    it("should return the count of matching users based on username or email", async () => {
      const mockCount = 2;
      MongooseService.prototype.count.mockResolvedValue(mockCount);

      const result = await userService.checkIfUserExist("username", "email");

      expect(MongooseService.prototype.count).toHaveBeenCalledWith({
        $or: [{ username: "username" }, { email: "email" }],
      });
      expect(result).toBe(mockCount);
    });
    it("should return 0 if no matching users are found", async () => {
      const mockCount = 0;
      MongooseService.prototype.count.mockResolvedValue(mockCount);

      const result = await userService.checkIfUserExist("username", "email");

      expect(MongooseService.prototype.count).toHaveBeenCalledWith({
        $or: [{ username: "username" }, { email: "email" }],
      });
      expect(result).toBe(mockCount);
    });
    it("should handle errors and throw an error when counting users", async () => {
      const mockError = new Error("Database connection error");
      MongooseService.prototype.count.mockRejectedValue(mockError);

      await expect(userService.checkIfUserExist("username", "email")).rejects.toThrow(mockError);
    });
  });
});
