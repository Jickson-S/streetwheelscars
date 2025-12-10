import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import supabase from "../supabaseClient.js"; // optional: to store URLs

export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const folder = req.body.folder || "cars";
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    // result.secure_url, result.public_id, result.format, result.bytes, etc.
    // Optionally save to Supabase:
    // await supabase.from('Car').update({ images: supabase.raw('array_append(images, ?)', [result.secure_url]) }).eq('id', carId);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message || err });
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files" });

    const folder = req.body.folder || "cars";
    const uploaded = [];
    for (const file of req.files) {
      const r = await uploadBufferToCloudinary(file.buffer, folder);
      uploaded.push(r);
    }
    res.json({ success: true, uploaded });
  } catch (err) {
    console.error("Multi upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: "public_id required" });

    const result = await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
    res.json({ success: true, result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
