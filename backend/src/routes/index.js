import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import partnerRoutes from "./partnerRoutes.js";
import carRoutes from "./carRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import driverRoutes from "./driverRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import uploadRoutes from "./uploadRoutes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/partners", partnerRoutes);
router.use("/cars", carRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/drivers", driverRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;
