const AuthValidator = require("../../validators/auth.validators");

describe("AuthValidators", () => {
  describe("validateLogin", () => {
    it("returns an error message if email or password is empty", () => {
      expect(AuthValidator.validateLogin("", "password")).toEqual({
        success: false,
        message: "Provide email and password.",
      });
      expect(AuthValidator.validateLogin("user@example.com", "")).toEqual({
        success: false,
        message: "Provide email and password.",
      });
    });

    it("returns a success message if email and password are provided", () => {
      expect(AuthValidator.validateLogin("user@example.com", "password")).toEqual({
        success: true,
      });
    });
  });
  describe("validateSignup", () => {
    it("returns an error message if email, password or username is empty", () => {
      expect(AuthValidator.validateSignup("", "password", "username")).toEqual({
        success: false,
        message: "Provide email, password and username",
      });
      expect(AuthValidator.validateSignup("user@example.com", "", "username")).toEqual({
        success: false,
        message: "Provide email, password and username",
      });
      expect(AuthValidator.validateSignup("user@example.com", "password", "")).toEqual({
        success: false,
        message: "Provide email, password and username",
      });
    });

    it("returns an error message if email is not valid", () => {
      expect(AuthValidator.validateSignup("userexample.com", "password", "username")).toEqual({
        success: false,
        message: "Provide a valid email address.",
      });
      expect(AuthValidator.validateSignup("user@example", "password", "username")).toEqual({
        success: false,
        message: "Provide a valid email address.",
      });
    });

    it("returns an error message if password is not valid", () => {
      expect(AuthValidator.validateSignup("user@example.com", "password", "username")).toEqual({
        success: false,
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      expect(AuthValidator.validateSignup("user@example.com", "password123", "username")).toEqual({
        success: false,
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      expect(AuthValidator.validateSignup("user@example.com", "PASSWORD", "username")).toEqual({
        success: false,
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    });

    it("returns a success message if all fields are valid", () => {
      expect(AuthValidator.validateSignup("user@example.com", "Password123", "username")).toEqual({
        success: true,
      });
    });
  });
});
