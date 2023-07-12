import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middleware/error.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import morgan from "morgan";
// import adminRoutes from "./routes/adminRoutes.js"
// import carsRoutes from "./routes/carsRoutes.js"

export const app = express();
// configurations
config({
  path: "./config/config.env",
});
const apiDocs = YAML.load("./api-docs.yaml");

// middlewares
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(errorMiddleware);
app.use(morgan("dev"));

//routes
// app.use("/api", adminRoutes);
// app.use("/api", carsRoutes);

// app.use("/api", dealershipRoutes);
// app.use("/api", dealRoutes);
// app.use("/api", soldVehiclesRoutes);
// app.use("/api", userRoutes);

// app.use('/api/admins', adminRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/dealerships', dealershipRoutes);
// app.use('/api/deals', dealRoutes);
// app.use('/api/cars', carsRoutes);
// app.use('/api/sold-vehicles', soldVehiclesRoutes);

// Routes
// app.use('/api/admins', adminRoutes);
app.use("/api/users", userRoutes);
// app.use('/api/dealerships', dealershipRoutes);
