import React from "react";
import { Instrument } from "@/types";

interface Props {
  instrument: Instrument;
}

const formatPrice = (price: number, symbol: string) => {
  return symbol.includes("USD") || symbol.includes("SPX")
    ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
};

const MarketSummary: React.FC<Props> = ({ instrument }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Market Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Today’s Range</span>
          <span className="font-medium text-gray-100">
            {formatPrice(instrument.low, instrument.symbol)} -{" "}
            {formatPrice(instrument.high, instrument.symbol)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Average Volume</span>
          <span className="font-medium text-gray-100">{instrument.volume}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Market Status</span>
          <span className="font-medium text-green-500">Open</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Updated</span>
          <span className="font-medium text-gray-100">
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;