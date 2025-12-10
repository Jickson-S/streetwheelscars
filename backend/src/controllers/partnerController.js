import supabase from "../supabaseClient.js";

export const createPartner = async (req, res) => {
  const userId = req.user.id;

  const payload = { ...req.body, user_id: userId };

  const { data, error } = await supabase
    .from("Partner")
    .insert([payload])
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const getMyPartnerProfile = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("Partner")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};

export const getAllPartners = async (req, res) => {
  const { data, error } = await supabase.from("Partner").select("*");
  if (error) return res.status(500).json(error);
  res.json(data);
};

export const updatePartnerStatus = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("Partner")
    .update({ status: req.body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json(error);
  res.json(data);
};
