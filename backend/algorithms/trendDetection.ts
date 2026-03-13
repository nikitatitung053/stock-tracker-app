export function detectTrend(prices: number[]) {
  const last3 = prices.slice(-3);
  if (last3[0] < last3[1] && last3[1] < last3[2]) return "Uptrend";
  if (last3[0] > last3[1] && last3[1] > last3[2]) return "Downtrend";
  return "Sideways";
}