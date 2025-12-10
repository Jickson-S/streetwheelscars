import supabase from "../supabaseClient.js";

export const sendNotification = async (req, res) => {
  const payload = req.body;

  const { data, error } = await supabase
    .from("Notification")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);

  req.app.get("io").emit("notification", data);
  res.json(data);
};
