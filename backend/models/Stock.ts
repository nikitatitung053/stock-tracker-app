import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  symbol: String,
  companyName: String,
  price: Number,
  volume: Number,
});

export default mongoose.models.Stock || mongoose.model("Stock", StockSchema);