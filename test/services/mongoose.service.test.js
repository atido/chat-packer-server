const MongooseService = require("../../services/mongoose.service");
const mongoose = require("mongoose");

beforeAll(async () => {
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat-packer";
  await mongoose.connect(MONGO_URI).catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("MongooseService", () => {
  let service;
  let Model;

  beforeAll(() => {
    Model = mongoose.model("TestModel", new mongoose.Schema({ username: String, name: String }));
    service = new MongooseService(Model);
  });

  afterEach(async () => {
    await Model.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection("testmodels", (err, result) =>
      console.log("Collection droped")
    );
  });

  describe("create", () => {
    it("should create a new document in the database", async () => {
      const doc = await service.create({ name: "Test" });
      expect(doc).toBeDefined();
      expect(doc.name).toEqual("Test");
    });
  });

  describe("delete", () => {
    it("should delete a document from the database by id", async () => {
      const doc = await Model.create({ name: "Test" });
      await service.delete(doc._id);
      const result = await Model.findById(doc._id);
      expect(result).toBeNull();
    });
  });

  describe("findOne", () => {
    it("should find a document in the database by query", async () => {
      const doc = await Model.create({ name: "Test" });
      const result = await service.findOne({ name: "Test" });
      expect(result).toBeDefined();
      expect(result._id.toString()).toEqual(doc._id.toString());
    });
  });

  describe("findById", () => {
    it("should find a document in the database by id", async () => {
      const doc = await Model.create({ name: "Test" });
      const result = await service.findById(doc._id);
      expect(result).toBeDefined();
      expect(result._id.toString()).toEqual(doc._id.toString());
    });
  });

  describe("update", () => {
    it("should update a document in the database by id", async () => {
      const doc = await Model.create({ name: "Test" });
      const result = await service.update(doc._id, { name: "Updated" });
      expect(result).toBeDefined();
      expect(result.name).toEqual("Updated");
      const updatedDoc = await Model.findById(doc._id);
      expect(updatedDoc.name).toEqual("Updated");
    });
  });

  describe("findOneAndUpdate", () => {
    it("should update a document in the database by query", async () => {
      const doc = await Model.create({ username: "testUsername", name: "test" });
      const result = await service.findOneAndUpdate(
        { username: doc.username },
        { name: "Updated" }
      );
      expect(result).toBeDefined();
      expect(result.name).toEqual("Updated");
      const updatedDoc = await Model.findById(doc._id);
      expect(updatedDoc.name).toEqual("Updated");
    });
  });
  describe("count", () => {
    it("should count one document in the database by query", async () => {
      await Model.create({ name: "Test" });
      const result = await service.count({ name: "Test" });
      expect(result).toBeDefined();
      expect(result).toEqual(1);
    });
    it("should count 0 document in the database by query", async () => {
      await Model.create({ name: "Test2" });
      const result = await service.count({ name: "Test" });
      expect(result).toBeDefined();
      expect(result).toEqual(0);
    });
  });
});
