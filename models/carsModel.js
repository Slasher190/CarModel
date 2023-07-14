import { getDatabase } from "../config/database.js";

const carsCollectionName = "cars";
// Create the admin collection if it doesn't exist
const createCarsCollection = async () => {
  const database = getDatabase();
  const carsCollectionExists = await database
    .listCollections({ name: carsCollectionName })
    .hasNext();

  if (!carsCollectionExists) {
    await database.createCollection(carsCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["car_id", "type", "name", "model"],
          properties: {
            // car_id: { bsonType: "string" },
            type: { bsonType: "string" },
            name: { bsonType: "string" },
            model: { bsonType: "string" },
            car_info: { bsonType: "object" },
            created_at: { bsonType: "date" },
          },
        },
      },
    });
  }
};

export const Cars = {
  createCarsCollection,
  createCar: async (car) => {
    try {
      const database = await getDatabase();
      const carsCollection = await database.collection(carsCollectionName);
      await carsCollection.insertOne(car);
      return car;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },
  findAll: async () => {
    try {
      const database = await getDatabase();
      const carsCollection = await database.collection(carsCollectionName);
      const cars = await carsCollection.find().toArray();
      return cars;
    } catch (error) {
      console.error("Error retrieving cars:", error);
      throw new Error("Failed to retrieve cars");
    }
  },
  findById: async (carId) => {
    try {
      const database = await getDatabase();
      const carsCollection = await database.collection(carsCollectionName);
      const car = await carsCollection.findOne({ _id: carId });
      return car;
    } catch {
      console.log("Error retrieving cars:", error);
      throw new Error("Failed to retrieve the car");
    }
  },
  findByDealershipId: async (dealershipId) => {
    try {
      const database = await getDatabase();
      const carsCollection = await database.collection(carsCollectionName);
      const cars = await carsCollection.find({ dealership_id: dealershipId }).toArray();
      return cars;
    } catch (error) {
      console.error("Error retrieving cars:", error);
      throw new Error("Failed to retrieve cars");
    }
  },
};

export default Cars;
