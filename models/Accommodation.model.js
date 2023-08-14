const priceSchema = require('./price.schema');

const { Schema, model } = require('mongoose');

const accommodationSchema = new Schema(
  {
    apiId: { type: String, require: true },
    name: { type: String, required: true },
    url: { type: String },
    city: { type: String, required: true },
    coordinates: { latitude: { type: Number }, longitude: { type: Number } },
    rating: { type: Number },
    amenities: [{ type: String }],
    images: [{ type: String }],
    price: { type: priceSchema, required: true },
    isSelected: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const Accommodation = model('Accommodation', accommodationSchema);

module.exports = Accommodation;
