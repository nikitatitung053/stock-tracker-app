export function linearRegression(prices: number[]) {

  const n = prices.length
  const x = Array.from({ length: n }, (_, i) => i + 1)

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = prices.reduce((a, b) => a + b, 0)

  const sumXY = x.reduce((acc, val, i) => acc + val * prices[i], 0)

  const sumXX = x.reduce((acc, val) => acc + val * val, 0)

  const slope =
    (n * sumXY - sumX * sumY) /
    (n * sumXX - sumX * sumX)

  const intercept =
    (sumY - slope * sumX) / n

  const nextX = n + 1

  const predictedPrice =
    slope * nextX + intercept

  return {
    slope,
    predictedPrice
  }
}