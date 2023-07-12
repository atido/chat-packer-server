const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthValidator = require("../../validators/auth.validators");

const UserService = require("../../services/user.service");
const userService = new UserService();

async function login(req, res, next) {
  const { email, password } = req.body;

  const result = AuthValidator.validateLogin(email, password);
  if (!result.success) return res.status(400).json({ errorMessage: result.message });

  try {
    const foundUser = await userService.getUserByEmail(email);
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const { _id, email, username } = foundUser;
      const payload = { _id, username, email };
      const authToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      return res.status(200).json({ authToken: authToken });
    } else {
      return res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
