"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface PriceData {
  time: number;
  price: number;
}

interface ChartDataPoint extends PriceData {
  prediction: number;
}

export default function LinearRegressionChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState<PriceData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPrice = async () => {
      try {
        // Replace with your real API endpoint
        const res = await fetch(`/api/stock-price?symbol=${encodeURIComponent(symbol)}`);
        const json = await res.json();

        if (!isMounted || !json.price) return;

        const newPoint: PriceData = {
          time: Date.now(),
          price: Number(json.price),
        };

        setData((prev) => [...prev, newPoint].slice(-20)); // keep last 20 points
      } catch (err) {
        console.error("Fetch price error:", err);
      }
    };

    fetchPrice(); // initial fetch
    const interval = setInterval(fetchPrice, 5000); // update every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  // Linear regression calculation
  const regressionData = (): ChartDataPoint[] => {
    const n = data.length;
    if (n === 0) return [];

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    data.forEach((d, i) => {
      sumX += i;
      sumY += d.price;
      sumXY += i * d.price;
      sumXX += i * i;
    });

    const denominator = n * sumXX - sumX * sumX;
    const slope = denominator ? (n * sumXY - sumX * sumY) / denominator : 0;
    const intercept = (sumY - slope * sumX) / n;

    return data.map((d, i) => ({
      ...d,
      prediction: slope * i + intercept,
    }));
  };

  const chartData = regressionData();

  return (
    <div className="w-full min-h-[400px] bg-gray-800 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="time"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            stroke="#fff"
          />
          <YAxis stroke="#fff" />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            contentStyle={{ backgroundColor: "#222", borderRadius: 6, border: "none" }}
          />
          <Line type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#f87171"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}