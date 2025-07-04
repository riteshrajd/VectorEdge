'use client';

import { JSX, useState } from 'react';
import Header from "./Header";
import MainContent from "./MainContent";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { Instrument } from "../types";

export default function ClientPage(): JSX.Element {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

  const handleInstrumentSelect = (instrument: Instrument): void => {
    setSelectedInstrument(instrument);
    console.log('Selected instrument:', instrument);
  };

  return (
    <div className="flex flex-col h-screen font-roboto overflow-hidden">
      <div className="w-full z-10 flex-shrink-0">
        <Header />
      </div>
      <div className="flex flex-1 h-full min-h-0">
        <SidebarLeft onItemSelect={handleInstrumentSelect} />
        <main className="flex-1 min-w-0 bg-background">
          <MainContent selectedInstrument={selectedInstrument} />
        </main>
        <SidebarRight selectedInstrument={selectedInstrument} />
      </div>
    </div>
  );
}