import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCarsByDealership
} from "../controllers/dealershipController.js";
import { isAuthenticatedDealer } from "../middleware/auth.js";

const router = express.Router();
//dealership registration
router.route("/register").post(register);

router.route("/login").post(login);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/cars").get(isAuthenticatedDealer,getCarsByDealership)

export default router;
