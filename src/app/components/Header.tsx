import Image from "next/image";
import React, { useEffect } from "react";

export default function Header() {
  function setTheme(theme: string) {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }

  // On initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "";
    document.documentElement.className = savedTheme;
  }, []);
  return (
    <div
      className="relative font-roboto font-extralight text-white h-12 w-full flex flex-col items-center justify-center p-2 overflow-clip"
      // style={{ position: "relative" }} // 'relative' is already in className, no need for inline style unless overriding
    >
      <Image
        alt="Background gradient"
        fill // Fills the parent container
        src="/assets/images/image.png" // Ensure this path is correct relative to the public directory
        className="absolute -z-10 object-cover brightness-120" // z-0 is correct for putting it behind relative content
        priority
        quality={100} // Optional: for better quality
      />
      <p className="relative z-10">
        Pro Launching Soon - Prebook and get upto 60% off
      </p>{" "}
      {/* Text stays above the image */}
      <div className="flex bg-red-800 gap-4">
        {/* <button onclick={setTheme('dark-theme')}>Dark</button>
        <button onclick={setTheme('light-theme')}>Light</button> */}
        <button onClick={() => setTheme("high-contrast-theme")}>
          High Contrast
        </button>
        <button onClick={() => setTheme("")}>Default Theme</button>
        {/* <button onclick={setTheme('vibrant-theme')}>Vibrant</button>
        <button onclick={setTheme('pastel-theme')}>Pastel</button>
        <button onclick={setTheme('midnight-theme')}>Midnight</button>
        <button onclick={setTheme('solarized-theme')}>Solarized</button>
        <button onclick={setTheme('monochrome-theme')}>Monochrome</button> */}
      </div>
    </div>
  );
}
