import Stock from "../models/Stock";
import Signal from "../models/Signal";
import { movingAverage } from "../algorithms/movingAverage";
import { detectTrend } from "../algorithms/trendDetection";

export async function getStockSignals(req: any, res: any) {
  try {
    const stocks = await Stock.find();

    const signals = await Promise.all(
      stocks.map(async (stock) => {
        const prices = [stock.price - 5, stock.price - 2, stock.price]; // Example
        const movingAvg = movingAverage(prices, 3);
        const trend = detectTrend(prices);
        const signal = stock.price > movingAvg ? "BUY" : "SELL";

        const savedSignal = await Signal.findOneAndUpdate(
          { symbol: stock.symbol },
          { movingAvg, trend, signal, createdAt: new Date() },
          { upsert: true, new: true }
        );

        return savedSignal;
      })
    );

    res.status(200).json(signals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching signals", error: err });
  }
}