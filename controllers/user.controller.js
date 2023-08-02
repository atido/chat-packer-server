const UserService = require('../services/user.service');
const AuthValidator = require('../validators/auth.validators');
const userServiceInstance = new UserService();

async function getUser(req, res, next) {
  try {
    const { _id, username, email, avatar } = await userServiceInstance.getUserById(req.payload.user._id);
    return res.status(200).json({ _id, username, email, avatar });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  const { email, password, username } = req.body;

  const result = AuthValidator.validateSignup(email, password, username);
  if (!result.success) return res.status(400).json({ message: result.message });

  try {
    const userToUpdate = await userServiceInstance.getUserById(req.payload.user._id);
    if (!userToUpdate) return res.status(400).json({ message: 'User not found.' });

    const isOtherUserWithSameUsername = await userServiceInstance.checkOtherUserWithSameUsername(req.payload.user._id, username);
    if (isOtherUserWithSameUsername) return res.status(400).json({ message: 'User already exist with the same username.' });

    const updatedUser = await userServiceInstance.updateUser(req.payload.user._id, email, password, username);
    return res.status(202).json({
      user: { _id: updatedUser._id, username: updatedUser.username },
    });
  } catch (err) {
    next(err);
  }
}

async function uploadAvatar(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ message: 'File is missing. Please include a file to upload.' });
  }
  return res.status(202).json({ fileUrl: req.file.path });
}

async function updateAvatar(req, res, next) {
  try {
    const updatedUser = await userServiceInstance.updateAvatar(req.payload.user._id, req.body.avatar);
    return res.status(202).json({
      user: { _id: updatedUser._id, username: updatedUser.username },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, updateUser, uploadAvatar, updateAvatar };
