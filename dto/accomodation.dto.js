class AccomodationDTO {
  constructor(accomodationFromApi) {
    this.id = accomodationFromApi.id;
    this.url = accomodationFromApi.url;
    this.deeplink = accomodationFromApi.deeplink;
    this.name = accomodationFromApi.name;
    this.city = accomodationFromApi.city;
    this.images = accomodationFromApi.images.slice(0, 3);
    this.rating = accomodationFromApi.rating;
    this.price = {
      total: accomodationFromApi.price.total,
      currency: accomodationFromApi.price.currency,
    };
  }
}
module.exports = AccomodationDTO;
