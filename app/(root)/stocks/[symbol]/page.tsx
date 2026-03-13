// import TradingViewWidget from "@/components/TradingViewWidget";
// import WatchlistButton from "@/components/WatchlistButton";
// import LinearRegressionChart from "@/components/LinearRegressionChart";

// import {
//   SYMBOL_INFO_WIDGET_CONFIG,
//   CANDLE_CHART_WIDGET_CONFIG,
//   BASELINE_WIDGET_CONFIG,
//   TECHNICAL_ANALYSIS_WIDGET_CONFIG,
//   COMPANY_PROFILE_WIDGET_CONFIG,
//   COMPANY_FINANCIALS_WIDGET_CONFIG,
// } from "@/lib/constants";

// export default async function StockDetails({ params }: StockDetailsPageProps) {
//   const { symbol } = await params;
//   const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

//   return (
//     <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
//       <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
//         {/* Left column */}
//         <div className="flex min-w-0 flex-col gap-6">
//         {/* <div className="flex flex-col gap-6"> */}
//           <TradingViewWidget
//             scriptUrl={`${scriptUrl}symbol-info.js`}
//             config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
//             height={170}
//           />

//           {/* <TradingViewWidget
//             scriptUrl={`${scriptUrl}advanced-chart.js`}
//             config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
//             className="custom-chart"
//             height={600}
//           />

//           <TradingViewWidget
//             scriptUrl={`${scriptUrl}advanced-chart.js`}
//             config={BASELINE_WIDGET_CONFIG(symbol)}
//             className="custom-chart"
//             height={600}
//           /> */}
//           <LinearRegressionChart symbol={symbol} />
//         </div>

//         {/* Right column */}
//         <div className="flex flex-col gap-6">
//           <div className="flex items-center justify-between">
//             <WatchlistButton symbol={symbol.toUpperCase()} company={symbol.toUpperCase()} isInWatchlist={false} />
//           </div>

//           <TradingViewWidget
//             scriptUrl={`${scriptUrl}technical-analysis.js`}
//             config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
//             height={400}
//           />

//           <TradingViewWidget
//             scriptUrl={`${scriptUrl}company-profile.js`}
//             config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
//             height={440}
//           />

//           <TradingViewWidget
//             scriptUrl={`${scriptUrl}financials.js`}
//             config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
//             height={464}
//           />
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import LinearRegressionChart from "@/components/LinearRegressionChart";

// --- Watchlist button ---
function WatchlistButton({
  symbol,
  isInWatchlist,
  onToggle,
}: {
  symbol: string;
  isInWatchlist: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`px-4 py-2 rounded font-semibold ${
        isInWatchlist ? "bg-red-500" : "bg-yellow-500"
      }`}
      onClick={onToggle}
    >
      {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"} {symbol}
    </button>
  );
}

// --- Main Stock Page ---
export default function StockDetails() {
  const params = useParams();
  const symbol =
    typeof params?.symbol === "string" ? params.symbol.toUpperCase() : "UNKNOWN";

  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const handleWatchlistToggle = () => setIsInWatchlist((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-900 text-gray-100 gap-6">
      <h1 className="text-3xl font-bold">{symbol} Stock Details</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Linear Regression Chart */}
        <div className="flex-1 min-h-[400px]">
          <LinearRegressionChart symbol={symbol} />
        </div>

        {/* Right: Watchlist + Info */}
        <div className="flex flex-col gap-4 md:w-64">
          <WatchlistButton
            symbol={symbol}
            isInWatchlist={isInWatchlist}
            onToggle={handleWatchlistToggle}
          />
          <div className="p-4 rounded bg-gray-800 text-gray-400">
            <p>Additional stock info, stats, or analysis can go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


