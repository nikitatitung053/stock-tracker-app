import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema({
  userId: String,
  stockSymbol: String,
});

export default mongoose.models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);