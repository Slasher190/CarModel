import { app } from "./app.js";
import { connectToDatabase } from "./config/database.js";

connectToDatabase();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port:${process.env.PORT}`);
});

