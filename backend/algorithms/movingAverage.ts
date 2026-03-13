export function movingAverage(prices: number[], days: number) {
  const recent = prices.slice(-days);
  const sum = recent.reduce((a, b) => a + b, 0);
  return sum / days;
}