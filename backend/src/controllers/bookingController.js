import supabase from "../supabaseClient.js";

export const createBooking = async (req, res) => {
  try {
    const payload = { ...req.body, customer_id: req.user.id };

    // Check if car is free for selected dates
    const { data: conflicts } = await supabase
      .from("Booking")
      .select("*")
      .eq("car_id", payload.car_id)
      .not("status", "in", "(cancelled, completed)");

    if (conflicts?.length) {
      return res
        .status(400)
        .json({ error: "Car not available for selected dates" });
    }

    const { data, error } = await supabase
      .from("Booking")
      .insert([payload])
      .select()
      .single();

    if (error) return res.status(500).json(error);

    req.app.get("io").emit("newBooking", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("Booking")
    .select("*")
    .or(`customer_id.eq.${userId},partner_id.eq.${userId}`);

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Booking")
    .update({ status: req.body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json(error);

  req.app.get("io").emit("bookingUpdated", data);
  res.json(data);
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Booking")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};
