import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, capacity, organizerName } = req.body;

  // It acts as a validation that no field is empty
  if(
    [title, description, date, location, capacity, organizerName].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400, "Please provide all required event details")
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    capacity,
    organizerName,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, event, "Event created successfully")
    );
});


const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  return res
  .status(200)
  .json(
    new ApiResponse(200, events, "Events fetched successfully")
  );
});


const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, event, "Event fetched successfully")
  );
});


const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { name, email } = req.body;

  if(
    [name, email].some((field) => field.trim() === "")
  ){
    throw new ApiError(400, "Name and email are required");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.registeredUsers.length >= event.capacity) {
    throw new ApiError(400, "Event capacity reached");
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    user = await User.create({ name, email });
  }

  const alreadyRegistered = event.registeredUsers.includes(user._id);
  if (alreadyRegistered) {
    throw new ApiError(400, "User already registered for this event");
  }

  event.registeredUsers.push(user._id);
  user.events.push(event._id);
  
  await event.save();
  await user.save();

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        event,
        user
      },
      "Registered successfully")
  );
});


export{
    createEvent,
    getAllEvents,
    getEventById,
    registerForEvent
};
