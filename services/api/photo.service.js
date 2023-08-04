const { createApi } = require('unsplash-js');

class PhotoService {
  constructor() {
    this.photoApi = createApi({
      accessKey: process.env.PHOTO_SERVICE_API_ACCESSKEY,
    });
  }

  async getRandomPhoto(query) {
    try {
      const result = await this.photoApi.photos.getRandom({ query, orientation: 'landscape' });
      return { photo: result.response.urls.regular };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PhotoService;
