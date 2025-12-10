import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/", auth, upload.array("images"), addCar);
router.get("/", getCars);
router.get("/:id", getCarById);

router.put("/:id", auth, upload.array("images"), updateCar);
router.delete("/:id", auth, deleteCar);

router.post("/:id/delete-image", auth, deleteCarImage);

export default router;






