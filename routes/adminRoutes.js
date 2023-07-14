import express from "express";
import { registerAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.route("/register").post(registerAdmin);

export default router;
