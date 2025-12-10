import express from "express";
import upload from "../utils/multer.js";
import { uploadSingleImage, uploadMultipleImages, deleteImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/single", upload.single("image"), uploadSingleImage);
router.post("/multiple", upload.array("images"), uploadMultipleImages);
router.post("/delete", deleteImage);

export default router;
