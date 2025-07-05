"use client";

import { JSX, useState } from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import { Instrument } from "./types";
import Image from "next/image";
import ThemeSelector from "./components/ThemeSelector";

export default function Home(): JSX.Element {
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const handleInstrumentSelect = (instrument: Instrument): void => {
    setSelectedInstrument(instrument);
    console.log("Selected instrument:", instrument);
  };

  return (
    <div className="flex flex-col h-screen font-sans overflow-clip bg-[var(--bg-main)]">
      {/* <div className="w-full z-10"><Header /></div> */}
      {/* <div className="w-full z-10"><ThemeSelector /></div> */}
      <div className="flex flex-1 min-h-0 relative">
        {/* <Image
          alt="Background gradient"
          fill
          src="/assets/images/image_bg_grid.png"
          className="absolute inset-0 object-cover -z-10 brightness-20" // Added inset-0 and -z-10
          priority
          quality={100}
        /> */}
        <SidebarLeft onItemSelect={handleInstrumentSelect} />
        <main className="flex-1 min-w-0 text-white">
          <MainContent selectedInstrument={selectedInstrument} />
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}
