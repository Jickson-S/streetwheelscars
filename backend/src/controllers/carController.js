import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import { supabase } from "../supabaseClient.js";
import cloudinary from "../utils/cloudinary.js";

export const addCar = async (req, res) => {
  try {
    const partner_id = req.user.id; // from auth middleware

    const {
      title,
      brand,
      model,
      year,
      fuel_type,
      transmission,
      seats,
      color,
      price_per_day,
      price_per_hour,
      reg_number,
      location_address
    } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await uploadBufferToCloudinary(file.buffer, "cars");
        imageUrls.push(upload.secure_url);
      }
    }

    const { data, error } = await supabase.from("Car").insert({
      partner_id,
      title,
      brand,
      model,
      year,
      fuel_type,
      transmission,
      seats,
      color,
      price_per_day,
      price_per_hour,
      reg_number,
      location_address,
      images: imageUrls,
    }).select("*");

    if (error) return res.status(400).json({ error });

    return res.status(201).json({
      success: true,
      car: data[0],
    });
  } catch (err) {
    console.error("Add Car Error:", err);
    res.status(500).json({ error: "Failed to add car" });
  }
};


export const getCars = async (req, res) => {
  const { brand, q } = req.query;

  let query = supabase.from("Car").select("*");

  if (brand) query = query.eq("brand", brand);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const getCarById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Car")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    let newImageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await uploadBufferToCloudinary(file.buffer, "cars");
        newImageUrls.push(upload.secure_url);
      }
    }

    const fields = req.body;

    const { data: existing, error: existingError } = await supabase
      .from("Car")
      .select("images")
      .eq("id", id)
      .single();

    if (existingError) return res.status(404).json({ error: "Car not found" });

    const updatedImages = [...existing.images, ...newImageUrls];

    const { data, error } = await supabase
      .from("Car")
      .update({
        ...fields,
        images: updatedImages,
      })
      .eq("id", id)
      .select("*");

    if (error) return res.status(400).json({ error });

    return res.json({ success: true, car: data[0] });
  } catch (err) {
    console.error("Update Car Error:", err);
    res.status(500).json({ error: "Failed to update car" });
  }
};


export const deleteCar = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("Car").delete().eq("id", id);

  if (error) return res.status(500).json(error);
  res.json({ success: true });
};

export const deleteCarImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(`cars/${publicId}`);

    const { data: car } = await supabase
      .from("Car")
      .select("images")
      .eq("id", id)
      .single();

    const updatedImages = car.images.filter((img) => img !== imageUrl);

    await supabase.from("Car").update({ images: updatedImages }).eq("id", id);

    res.json({ success: true, images: updatedImages });
  } catch (err) {
    res.status(500).json({ error: "Image delete failed" });
  }
};
