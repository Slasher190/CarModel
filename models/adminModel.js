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
    const database = getDatabase();
    const adminCollection = database.collection(adminCollectionName);
    await adminCollection.insertOne(admin);
  },
};
export default Admin;
