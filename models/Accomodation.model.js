const priceSchema = require("./price.schema");

const { Schema, model, default: mongoose } = require("mongoose");

const accomodationSchema = new mongoose.Schema(
  {
    apiId: { type: String, require: true },
    name: { type: String, required: true },
    url: { type: String },
    city: { type: String, required: true },
    rating: { type: Number },
    amenities: [{ type: String }],
    price: { type: priceSchema, required: true },
    isSelected: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const Accomodation = model("Accomodation", accomodationSchema);

module.exports = Accomodation;
