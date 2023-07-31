class MongooseService {
  constructor(Model) {
    this.model = Model;
  }

  create(body) {
    return this.model.create(body);
  }

  insertMany(body) {
    return this.model.insertMany(body);
  }

  delete(id) {
    return this.model.findByIdAndDelete(id).exec();
  }

  find(query, projection) {
    return this.model.find(query, projection).exec();
  }

  findOneWithPopulate(query, projection, populatePathsArray) {
    return this.model.findOne(query, projection).populate(populatePathsArray).exec();
  }

  findOne(query, projection) {
    return this.model.findOne(query, projection).exec();
  }

  count(query) {
    return this.model.count(query).exec();
  }

  findOneAndUpdate(query, body, options = { new: true }) {
    return this.model.findOneAndUpdate(query, body, options).exec();
  }

  findById(id) {
    return this.model.findById(id).exec();
  }

  update(id, body, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, body, options).exec();
  }
}

module.exports = MongooseService;
