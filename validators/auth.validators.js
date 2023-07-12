class AuthValidator {
  static validateSignup(email, password, username) {
    if (!email || email === "" || !password || password === "" || !username || username === "") {
      return { success: false, message: "Provide email, password and username" };
    }

    // This regular expression check that the email is of a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Provide a valid email address." };
    }

    // This regular expression checks password for special characters and minimum length
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return {
        success: false,
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      };
    }
    return { success: true };
  }

  static validateLogin(email, password) {
    if (!email || email === "" || !password || password === "") {
      return { success: false, message: "Provide email and password." };
    }
    return { success: true };
  }
}
module.exports = AuthValidator;
