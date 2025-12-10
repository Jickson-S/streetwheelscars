import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addDriver,
  updateDriverLocation,
} from "../controllers/driverController.js";

const router = express.Router();

router.post("/", auth, addDriver);
router.put("/:id/location", auth, updateDriverLocation);

export default router;
