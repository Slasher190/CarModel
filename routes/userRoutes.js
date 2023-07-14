import express from "express";
import {
  forgotPassword,
  getCarsByDealershipId,
  loginUser,
  registerUser,
  resetPassword,
  getDealershipsByCarId,
} from "../controllers/userController.js";

import { getAllCars } from "../controllers/carsController.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/cars").get(getAllCars);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/dealerships/:dealershipId/cars").get(getCarsByDealershipId);

router.route("/cars/{carId}/dealerships").get(getDealershipsByCarId);

export default router;
