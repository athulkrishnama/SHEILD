import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    speedFactor: {
      type: Number,
      required: true,
      min: 0.1,
      max: 1.0,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    currentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
    totalRemainingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;
