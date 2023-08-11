const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  content: { type: String },
  expires: { type: Date, expires: 7200 },
});

const Session = model('Session', sessionSchema);

module.exports = Session;
