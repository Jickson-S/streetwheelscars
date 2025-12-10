import supabase from "../supabaseClient.js";

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("User")
    .update(req.body)
    .eq("id", userId)
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};
