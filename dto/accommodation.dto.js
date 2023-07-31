class AccommodationDTO {
  constructor(accommodationFromApi) {
    this.apiId = accommodationFromApi.id;
    this.url = accommodationFromApi.url;
    this.name = accommodationFromApi.name;
    this.city = accommodationFromApi.city;
    this.images = accommodationFromApi.images.slice(0, 3);
    this.rating = accommodationFromApi.rating;
    this.amenities = accommodationFromApi.previewAmenities;
    this.price = {
      total: accommodationFromApi.price.total,
      currency: accommodationFromApi.price.currency,
    };
  }
}
module.exports = AccommodationDTO;
