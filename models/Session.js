import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goal: { type: String, required: true },
    duration: { type: Number, required: true },
    result: { type: String, default: "" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    completed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);



