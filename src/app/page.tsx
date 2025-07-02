'use client';

import { JSX, useState } from 'react';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import { Instrument } from "./types";

export default function Home(): JSX.Element {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

  const handleInstrumentSelect = (instrument: Instrument): void => {
    setSelectedInstrument(instrument);
    console.log('Selected instrument:', instrument);
    // This will later be used to update the MainContent
  };

  return (
    <div className="flex flex-col bg-zinc-950 min-h-screen font-sans">
      <div className="w-full z-10">
        <Header />
      </div>
      <div className="flex flex-1">
        <SidebarLeft onItemSelect={handleInstrumentSelect} />
        <main className="flex-1 min-w-0 bg-zinc-950 text-white">
          <MainContent selectedInstrument={selectedInstrument} />
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}