const { Schema } = require("mongoose");

const priceSchema = new Schema({
  total: { type: Number, required: true },
  currency: { type: String, required: true },
});

module.exports = priceSchema;
