import { getDatabase } from "../config/database.js";

const userCollectionName = "user";

const createUserCollection = async () => {
  const database = getDatabase();
  const userCollectionExists = await database
    .listCollections({ name: userCollectionName })
    .hasNext();

  if (!userCollectionExists) {
    await database.createCollection(userCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["user_email", "user_id", "user_location", "password"],
          properties: {
            user_email: { bsonType: "string" },
            user_id: { bsonType: "string" },
            user_location: { bsonType: "string" },
            user_info: { bsonType: "object" },
            password: { bsonType: "string" },
            vehicle_info: { bsonType: "array" },
            created_at: { bsonType: "date" },
          },
        },
      },
    });
  }
};

export const User = {
  createUserCollection,
  createUser: async (user) => {
    try {
      const database = await getDatabase();
      const userCollection = await database.collection(userCollectionName);
      await userCollection.insertOne(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },
  getUserByEmail: async (email) => {
    try {
      const database = await getDatabase();
      const userCollection = database.collection(userCollectionName);

      const user = await userCollection.findOne({ user_email: email });
      return user;
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      throw new Error("Failed to retrieve user by email");
    }
  },
};

export default User;
