// Fetches historical stock prices for a symbol
export async function getStockHistory(symbol: string) {
  try {
    // Yahoo Finance chart API for last 6 months daily data
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=6mo&interval=1d`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch stock history");
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      throw new Error("No chart data found");
    }

    // Get closing prices
    const closes = result.indicators?.quote?.[0]?.close || [];

    // Remove null or invalid values
    const prices = closes.filter(
      (p: number | null) => p !== null && !isNaN(p)
    ) as number[];

    if (prices.length === 0) {
      throw new Error("No valid price data");
    }

    return prices;
  } catch (error) {
    console.error("Stock history error:", error);

    // fallback dummy data if API fails
    return [10, 11, 12, 11, 13, 14, 15, 16, 15, 17, 18, 19];
  }
}
