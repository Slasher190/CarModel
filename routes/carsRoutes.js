import express from "express";
import { createVehicle } from "../controllers/carsController.js";

const router = express.Router();

router.route("/vehicle/new").post(createVehicle);

export default router;
