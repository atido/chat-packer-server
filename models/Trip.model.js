const { Schema, model, default: mongoose } = require("mongoose");

const priceSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  currency: { type: String, required: true },
});

const airportDateSchema = new Schema({
  date: { type: Date, required: true, trim: true },
  time: { type: String, required: true, trim: true },
});

const airportSchema = new Schema({
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  displayCode: { type: String, required: true, trim: true },
});

const legSchema = new mongoose.Schema({
  origin: { type: airportSchema, required: true },
  destination: { type: airportSchema, required: true },
  departure: { type: airportDateSchema, required: true },
  arrival: { type: airportDateSchema, required: true },
  stopCount: { type: Number },
  duration: { type: String },
  carrierLogo: { type: String, required: true },
});
const flightSchema = new mongoose.Schema({
  url: { type: String },
  price: { type: priceSchema, required: true },
  go: { type: legSchema, required: true },
  back: { type: legSchema, required: true },
});

const accomodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String },
  city: { type: String, required: true },
  rating: { type: Number },
  amenities: [{ type: String }],
  price: { type: priceSchema, required: true },
});

const itinerarySchema = new mongoose.Schema({
  mdText: { type: String },
});

const tripInfoSchema = new mongoose.Schema({
  departureCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
});

const tripSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tripInfo: { type: tripInfoSchema, required: true },
    flight: { type: flightSchema, required: true },
    accomodation: { type: accomodationSchema, required: true },
    itinerary: { type: itinerarySchema },
    destinationPhoto: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
