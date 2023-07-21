const { Schema, model } = require("mongoose");

const itinerarySchema = new Schema({
  mdText: { type: String },
});

const tripInfoSchema = new Schema({
  departureCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
});

const tripSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tripInfo: { type: tripInfoSchema, required: true },
    flight: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    accomodation: { type: Schema.Types.ObjectId, ref: "Accomodation", required: true },
    itinerary: { type: itinerarySchema },
    destinationPhoto: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Trip = model("Trip", tripSchema);

module.exports = Trip;
