const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  content: { type: String },
  expireAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000 },
});
// remove session at expireAt date
sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Session = model('Session', sessionSchema);

module.exports = Session;
