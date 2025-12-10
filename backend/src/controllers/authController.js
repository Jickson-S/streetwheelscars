import supabase from "../supabaseClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role = "customer" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email & password required" });
    }

    const { data: existing } = await supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (existing?.length)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from("User")
      .insert([{ name, email, phone, password: hashedPassword, role }])
      .select()
      .single();

    if (error) return res.status(500).json(error);

    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ user: data, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || !data.length)
      return res.status(400).json({ error: "User not found" });

    const user = data[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
