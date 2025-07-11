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

const KeyMetrics: React.FC<Props> = ({ instrument }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Key Metrics</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">High (52W)</span>
          <span className="font-medium text-gray-100">
            {formatPrice(instrument.high * 1.15, instrument.symbol)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Low (52W)</span>
          <span className="font-medium text-gray-100">
            {formatPrice(instrument.low * 0.85, instrument.symbol)}
          </span>
        </div>
        {instrument.pe > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">P/E Ratio</span>
              <span className="font-medium text-gray-100">{instrument.pe.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">EPS</span>
              <span className="font-medium text-gray-100">
                ₹{instrument.eps.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dividend Yield</span>
              <span className="font-medium text-gray-100">
                {instrument.dividend.toFixed(2)}%
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">Sector</span>
          <span className="font-medium text-gray-100">{instrument.sector}</span>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;