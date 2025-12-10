import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/index.js";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ===============================
// HTTP SERVER + SOCKET.IO
// ===============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ===============================
// SOCKET.IO EVENTS
// ===============================
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Join room for bookings
  socket.on("joinBookingRoom", (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`User joined room booking_${bookingId}`);
  });

  // Message chat (customer <-> partner)
  socket.on("sendMessage", async (data) => {
    const { booking_id, sender_id, message } = data;

    // Save chat message in DB
    await supabase.from("Chat").insert({
      booking_id,
      sender_id,
      message,
    });

    io.to(`booking_${booking_id}`).emit("newMessage", data);
  });

  // Realtime driver location tracking
  socket.on("updateDriverLocation", async (data) => {
    const { driver_id, lat, lng } = data;

    await supabase
      .from("Driver")
      .update({ gps_lat: lat, gps_lng: lng })
      .eq("id", driver_id);

    io.emit("driverLocationUpdated", { driver_id, lat, lng });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ===============================
// ROUTES
// ===============================
app.use("/api", router);

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Backend server running successfully");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
