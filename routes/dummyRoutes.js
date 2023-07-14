import express from "express";
import createDummyData from "../DummyData/createDummyData.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.route("/").get(createDummyData);

router.route("/info").get((req, res) => {
  const filePath = path.join(__dirname, "../Description/index.html");
  res.sendFile(filePath);
});

export default router;
