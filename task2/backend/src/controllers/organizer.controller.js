import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Organizer } from "../models/organizer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "event-secret", {
    expiresIn: "7d",
  });
};

const registerOrganizer = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingOrganizer = await Organizer.findOne({ email });
  if (existingOrganizer) {
    throw new ApiError(409, "Organizer already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const organizer = await Organizer.create({ name, email, password: hashedPassword });

  const token = generateToken(organizer._id);

  return res.status(201).json(
    new ApiResponse(201, { organizer: { id: organizer._id, name: organizer.name, email: organizer.email }, token }, "Organizer registered successfully")
  );
});

const loginOrganizer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const organizer = await Organizer.findOne({ email });
  if (!organizer) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, organizer.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(organizer._id);

  return res.status(200).json(
    new ApiResponse(200, { organizer: { id: organizer._id, name: organizer.name, email: organizer.email }, token }, "Organizer logged in successfully")
  );
});

const getCurrentOrganizer = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { id: req.organizer._id, name: req.organizer.name, email: req.organizer.email }, "Organizer profile fetched")
  );
});

export { registerOrganizer, loginOrganizer, getCurrentOrganizer };
