import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    organizerName: {
      type: String,
      required: true,
      trim: true,
    },
    registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
  },
  { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
