import { BarChart3 } from "lucide-react";
import React from "react";

export default function WelcomeScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-[var(--bg-main)]">
      <div className="text-center">
        <div className="w-30 h-30 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]">
          <BarChart3 className="w-16 h-16 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">
          Welcome to Analysis Dashboard
        </h2>
        <p className="max-w-md mx-auto text-[var(--text-secondary)]">
          Select an instrument from the sidebar to view detailed analysis,
          charts, and market data.
        </p>
      </div>
    </div>
  );
}
