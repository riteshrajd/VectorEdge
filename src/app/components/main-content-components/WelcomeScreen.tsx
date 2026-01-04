import { BarChart3, Server, Clock, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function WelcomeScreen() {
  const [isFirstBoot, setIsFirstBoot] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  useEffect(() => {
    // 1. ALWAYS fire wake-up requests to both servers on render to ensure no edge cases
    const wakeUpServers = () => {
      // Using no-cors to purely fire the request without caring about the response body
      fetch("https://vectoredge-socket.onrender.com/", { mode: "no-cors" }).catch(() => {});
      fetch("https://vectoredge-worker.onrender.com/", { mode: "no-cors" }).catch(() => {});
    };

    wakeUpServers();

    // 2. Handle Browser Cache Logic
    const CACHE_KEY = "vectoredge_wake_server_ts";
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    const storedTs = localStorage.getItem(CACHE_KEY);

    // If cache is missing OR it has been more than 1 hour
    if (!storedTs || now - parseInt(storedTs) > ONE_HOUR) {
      setIsFirstBoot(true);
      localStorage.setItem(CACHE_KEY, now.toString());
    } else {
      setIsFirstBoot(false);
    }
  }, []);

  // 3. Countdown Timer (Only runs if it is the first boot/expired cache)
  useEffect(() => {
    if (!isFirstBoot) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isFirstBoot]);

  // Helper to format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="h-full flex items-center justify-center bg-[var(--bg-main)]">
      <div className="text-center">
        {/* --- Original Welcome UI --- */}
        <div className="w-30 h-30 mx-auto mb-6 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)]">
          <BarChart3 className="w-16 h-16 text-[var(--text-muted)]" />
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-[var(--text-primary)]">
          Welcome to Analysis Dashboard
        </h2>
        <p className="max-w-md mx-auto text-[var(--text-secondary)]">
          Select an instrument from the sidebar to view detailed analysis.
        </p>
        <p className="mb-8 text-[var(--text-secondary)]">
          try searching Apple, MSFT, Tesla etc.
        </p>

        {/* --- Mandatory Warning Section --- */}
        <div className="max-w-md mx-auto mt-8 p-4 rounded-lg border border-orange-500/30 bg-orange-500/5 text-left">
          <div className="flex items-start gap-3">
            <Server className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-500 mb-1">
                Backend Status: Free Tier Limitation
              </h3>
              
              {isFirstBoot ? (
                // STATE 1: Cache Expired/Missing -> Show Timer
                <>
                  <p className="text-xs text-[var(--text-secondary)] mb-3">
                    The backend servers are currently sleeping. They are being booted up now. 
                    Please wait for the timer before searching or requesting data.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400 bg-orange-950/20 px-2 py-1 rounded w-fit">
                    <Clock className="w-3 h-3" />
                    <span>Estimated boot time: {formatTime(timeLeft)}</span>
                  </div>
                </>
              ) : (
                // STATE 2: Valid Cache -> Show Static Message
                <div className="text-xs text-[var(--text-secondary)]">
                  <p className="mb-2">
                    Servers have been signaled to wake up.
                  </p>
                  <div className="flex items-start gap-2 text-orange-400/80">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <p>
                      If you experience connection errors or empty data, the servers are still cold starting. 
                      Please wait 2-3 minutes and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}