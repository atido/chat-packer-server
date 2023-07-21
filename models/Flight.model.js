const priceSchema = require("./price.schema");

const { Schema, model } = require("mongoose");

const airportDateSchema = new Schema({
  date: { type: Date, required: true, trim: true },
  time: { type: String, required: true, trim: true },
});

const airportSchema = new Schema({
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  displayCode: { type: String, required: true, trim: true },
});

const legSchema = new Schema({
  origin: { type: airportSchema, required: true },
  destination: { type: airportSchema, required: true },
  departure: { type: airportDateSchema, required: true },
  arrival: { type: airportDateSchema, required: true },
  stopCount: { type: Number },
  duration: { type: String },
  carrierLogo: { type: String, required: true },
});

const flightSchema = new Schema(
  {
    apiId: { type: String, require: true },
    url: { type: String },
    price: { type: priceSchema, required: true },
    go: { type: legSchema, required: true },
    back: { type: legSchema, required: true },
    isSelected: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const Flight = model("Flight", flightSchema);

module.exports = Flight;
