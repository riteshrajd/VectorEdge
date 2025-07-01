import { useState } from 'react';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";

// Define type for instrument (replace with actual structure if needed)
type Instrument = {
  id: string;
  name: string;
  // Add other instrument properties as needed
} | null;

export default function Home() {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(null);

  const handleInstrumentSelect = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    console.log('Selected instrument:', instrument);
  };

  return (
    <div className="flex flex-col bg-zinc-950 min-h-screen">
      <div className="w-full">
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