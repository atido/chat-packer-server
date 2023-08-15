const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  content: { type: String },
  expireAt: { type: Date, default: () => new Date(+new Date() + process.env.SESSION_MAX_AGE) },
});
// remove session at expireAt date
sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Session = model('Session', sessionSchema);

module.exports = Session;
