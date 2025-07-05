// ThemeSlider.tsx
import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";

const ThemeSlider: React.FC = () => {
  const themes = [
    { name: "Dark", className: "", previewColor: "hsl(0, 0%, 15%)" },
    { name: "Light", className: "light-theme", previewColor: "hsl(0, 0%, 95%)" },
    { name: "High-Contrast", className: "high-contrast-theme", previewColor: "hsl(0, 0%, 0%)"},
    { name: "Solarized", className: "solarized-theme", previewColor: "hsl(30, 20%, 15%)" },
    { name: "Neon", className: "neon-theme", previewColor: "hsl(240, 10%, 10%)" },
    { name: "TokyoNight", className: "tokyo-night-theme", previewColor: "hsl(240, 17%, 10%)" },
  ];

  const [hidden, setHidden] = useState(true);

  const setTheme = useCallback((theme: string) => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, []);

  // On initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <div className="relative font-roboto font-extralight text-white h-12 w-full flex items-center justify-center p-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
      <Image
        alt="Background gradient"
        fill
        src="/assets/images/image.png"
        className="absolute -z-10 object-cover brightness-120 blur-[1px]"
        priority
        quality={100}
      />
      {!hidden && (
        <div className="relative z-10 flex space-x-4">
          {themes.map((theme) => (
            <div
              key={theme.className}
              onClick={() => setTheme(theme.className)}
              className="flex items-center cursor-pointer transition-all hover:scale-105"
            >
              <div
                className="w-16 h-8 rounded-lg border border-[var(--border)]"
                style={{ backgroundColor: theme.previewColor }}
              ></div>
              <span className="text-xs mt-1">
                {theme.name}
              </span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setHidden(!hidden)}
        className="bg-white/10 backdrop:blur-3xl rounded-2xl px-2 py-1"
      >
        Themes
      </button>
    </div>
  );
};

export default ThemeSlider;