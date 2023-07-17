const mongoose = require("mongoose");
const User = require("../../models/User.model");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat-packer";
  await mongoose.connect(MONGO_URI).catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("UserModel", () => {
  describe("save user", () => {
    it("saves a user in the database", async () => {
      const user = new User({
        email: "testuser@example.com",
        password: "mypassword",
        username: "testuser",
      });
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(user.email);
      expect(savedUser.username).toBe(user.username);

      await User.findByIdAndDelete(savedUser._id);
    });

    it("throws an error if a required field is missing", async () => {
      const user = new User({
        email: "testuser@example.com",
        username: "testuser",
      });
      let err;
      try {
        await user.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
    });

    it("throws an error if the email or username is not unique", async () => {
      const user1 = new User({
        email: "testuser@example.com",
        password: "mypassword",
        username: "testuser",
      });
      await user1.save();

      const user2 = new User({
        email: "testuser@example.com",
        password: "mypassword",
        username: "testuser",
      });
      let err;
      try {
        await user2.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();

      await User.findByIdAndDelete(user1._id);
    });
    test("pre save hook hashes password only if modified", async () => {
      const user = new User({
        email: "test@example.com",
        password: "mypassword",
        username: "testuser",
      });
      await user.save();

      user.username = "newusername";
      await user.save();

      // Vérifier que le mot de passe n'a pas été modifié lors de la deuxième sauvegarde
      expect(user.password).not.toBe("mypassword"); // car password crypté
      const isMatch = await bcrypt.compare("mypassword", user.password);
      expect(isMatch).toBe(true);

      await User.findByIdAndDelete(user._id);
    });
  });
});
