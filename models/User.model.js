const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT));
  }
  next();
});
userSchema.pre(['update', 'findByIdAndUpdate', 'findOneAndUpdate'], async function (next) {
  const passwordModified = this.getUpdate().password;
  if (passwordModified) {
    this.getUpdate().password = await bcrypt.hash(passwordModified, Number(process.env.BCRYPT_SALT));
  }

  next();
});

const User = model('User', userSchema);

module.exports = User;
