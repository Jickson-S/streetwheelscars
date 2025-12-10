import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createPartner,
  getMyPartnerProfile,
  getAllPartners,
  updatePartnerStatus,
} from "../controllers/partnerController.js";

const router = express.Router();

router.post("/", auth, createPartner); 
router.get("/me", auth, getMyPartnerProfile);
router.get("/", auth, getAllPartners);

router.put("/:id/status", auth, updatePartnerStatus);

export default router;
