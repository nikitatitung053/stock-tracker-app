// import { linearRegression } from "../algorithms/linearRegression"
// import { globalStocks } from "../data/globalStocks"

// export async function searchStocks(){

//   const results = globalStocks.map(stock => {

//     const result = linearRegression(stock.prices)

//     const signal =
//       result.slope > 0 ? "BUY" : "SELL"

//     return {
//       symbol: stock.symbol,
//       predictedPrice: result.predictedPrice.toFixed(2),
//       signal
//     }
//   })

//   return results
// }