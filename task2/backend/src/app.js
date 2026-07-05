import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event.route.js";
import userRoutes from "./routes/user.route.js";
import organizerRoutes from "./routes/organizer.route.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// remove this code later
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Event registration backend is running" });
});

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organizers", organizerRoutes);

export { app };
