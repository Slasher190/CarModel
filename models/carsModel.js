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
            car_id: { bsonType: "string" },
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
    const database = getDatabase();
    const carsCollection = database.collection(carsCollectionName);
    await carsCollection.insertOne(car);
  },
};

export default Cars;
