import React from "react";
import { Instrument } from "@/types";

interface Props {
  instrument: Instrument;
}

const RecentPerformance: React.FC<Props> = ({ instrument }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Performance</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-400">1 Week</div>
          <div
            className={`font-semibold ${
              instrument.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {instrument.change >= 0 ? "+" : ""}
            {(instrument.change * 1.2).toFixed(2)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">1 Month</div>
          <div
            className={`font-semibold ${
              instrument.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {instrument.change >= 0 ? "+" : ""}
            {(instrument.change * 2.5).toFixed(2)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">1 Year</div>
          <div
            className={`font-semibold ${
              instrument.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {instrument.change >= 0 ? "+" : ""}
            {(instrument.change * 8.2).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentPerformance;