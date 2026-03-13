import mongoose from "mongoose";

const SignalSchema = new mongoose.Schema({
  symbol: String,
  movingAvg: Number,
  trend: String,
  signal: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Signal || mongoose.model("Signal", SignalSchema);