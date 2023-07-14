import { getDatabase } from "../config/database.js";

const adminCollectionName = "admin";
// Create the admin collection if it doesn't exist
const createAdminCollection = async () => {
  const database = getDatabase();
  const adminCollectionExists = await database
    .listCollections({ name: adminCollectionName })
    .hasNext();

  if (!adminCollectionExists) {
    await database.createCollection(adminCollectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["admin_id", "password"],
          properties: {
            admin_id: { bsonType: "string" },
            password: { bsonType: "string" },
            created_at: { bsonType: "date" },
          },
        },
      },
    });
  }
};

export const Admin = {
  createAdminCollection,
  createAdmin: async (admin) => {
    try {
      const database = await getDatabase();
      const adminCollection = await database.collection(adminCollectionName);
      await adminCollection.insertOne(admin);
    } catch (error) {
      console.error("Error retrieving user by id:", error);
      throw new Error("Failed to retrieve user by id");
    }
  },
  getAdminByID: async (email) => {
    try {
      const database = await getDatabase();
      const userCollection = await database.collection(userCollectionName);

      const user = await userCollection.findOne({ admin_id: email });
      return user;
    } catch (error) {
      console.error("Error retrieving user by email:", error);
      throw new Error("Failed to retrieve user by email");
    }
  },
};
export default Admin;
