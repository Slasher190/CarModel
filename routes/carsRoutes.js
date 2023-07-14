import express from "express";
import {
  createVehicle,
  getAllCars,
  getCarById,
  //   getAllDealershipCars,
  getAllDealershipCarsByDealershipId,
  getSoldCarsByDealership,
} from "../controllers/carsController.js";

import { isAuthenticatedDealer } from "../middleware/auth.js";

const router = express.Router();

router.route("/vehicle/new").post(isAuthenticatedDealer, createVehicle);
router.route("/cars").get(getAllCars);
router.route("/cars/:carId").get(getCarById);
// router.route("/cars/dealership").get(getAllDealershipCars);
router
  .route("/cars/dealership/:dealershipId")
  .get(getAllDealershipCarsByDealershipId);
router
  .route("/cars/dealership/:dealershipId/sold")
  .get(getSoldCarsByDealership);

export default router;
