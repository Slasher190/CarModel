import { config } from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dummyRoutes from "./routes/dummyRoutes.js";
import carRoutes from "./routes/carsRoutes.js";
import dealershipRoutes from "./routes/dealershipRouters.js";
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
config();
const apiDocs = YAML.load("./api-docs.yaml");

// middlewares
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(errorMiddleware);
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/dealership", dealershipRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dummyData", dummyRoutes);
app.use("/api/cars", carRoutes);
