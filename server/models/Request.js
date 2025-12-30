import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    childName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    gift: {
      type: String,
      required: true,
    },
    giftPrice: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    heroScores: {
      type: Map,
      of: Number,
      default: {},
    },
    assignedHero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },
    eta: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["waiting", "assigned", "delivering", "completed"],
      default: "waiting",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
