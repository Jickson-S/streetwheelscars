import supabase from "../supabaseClient.js";

export const addDriver = async (req, res) => {
  const partnerId = req.user.id;

  const payload = { ...req.body, partner_id: partnerId };

  const { data, error } = await supabase
    .from("Driver")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const updateDriverLocation = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Driver")
    .update({
      gps_lat: req.body.lat,
      gps_lng: req.body.lng,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json(error);

  req.app.get("io").emit("driver_location", data);
  res.json(data);
};
