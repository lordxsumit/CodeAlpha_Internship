import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const getUserRegistrations = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).populate("events"); // In the findOne() we can also give object value as "email: email".
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.events, "Registrations fetched successfully"),
    );
});


const cancelRegistration = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { eventId } = req.params;

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const registrationIndex = event.registeredUsers.indexOf(user._id);
  if (registrationIndex === -1) {
    throw new ApiError(400, "Registration not found");
  }

  event.registeredUsers.splice(registrationIndex, 1);
  user.events = user.events.filter(
    (registeredEventId) => registeredEventId.toString() !== eventId,
  );
  await event.save();
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "", "Registration cancelled successfully")
    );
});


export {
  getUserRegistrations,
  cancelRegistration
};
