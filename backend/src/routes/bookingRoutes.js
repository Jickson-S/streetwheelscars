import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingById,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);

router.get("/:id", auth, getBookingById);
router.put("/:id/status", auth, updateBookingStatus);

export default router;
