const UserService = require("../../services/user.service");
const userServiceInstance = new UserService();
const AuthValidator = require("../../validators/auth.validators");

async function createSignup(req, res, next) {
  const { email, password, username } = req.body;

  const result = AuthValidator.validateSignup(email, password, username);
  if (!result.success) return res.status(400).json({ errorMessage: result.message });

  try {
    const isUserExist = await userServiceInstance.checkIfUserExist(username, email);
    if (isUserExist) return res.status(400).json({ errorMessage: "User already exists." });

    const createdUser = await userServiceInstance.createUser(
      email,
      password,
      username,
      process.env.AVATAR_DEFAULT_URL
    );

    return res.status(201).json({
      user: { _id: createdUser._id, username: createdUser.username },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSignup };
