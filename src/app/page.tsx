"use client";

import { JSX, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft2";
import SidebarRight from "./components/SidebarRight2";
import { Instrument } from "./types";
import Image from "next/image";

export default function Home(): JSX.Element {
  const [leftWidth, setLeftWidth] = useState(200); // initial px width
  const [rightWidth, setRightWidth] = useState(400);
  const [setIsRightCollapsed, setSetIsRightCollapsed] = useState(false);
  const [minRightWidth, setMinRightWidth] = useState(400)
  const [maxRightWidth, setMaxRightWidth] = useState(1000)


  const leftResizing = useRef(false);
  const rightResizing = useRef(false);

  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);

  const handleInstrumentSelect = (instrument: Instrument): void => {
    setSelectedInstrument(instrument);
    console.log("Selected instrument:", instrument);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
      if (leftResizing.current) {
        setLeftWidth(Math.max(100, e.clientX));
      }
      if (rightResizing.current) {
        setRightWidth(Math.max(minRightWidth, window.innerWidth - e.clientX));
      }
    };
  
    const handleMouseUp = () => {
      leftResizing.current = false;
      rightResizing.current = false;
      document.body.style.cursor = 'default';
    };
  
    const startResizingLeft = () => {
      leftResizing.current = true;
      document.body.style.cursor = 'col-resize';
    };
  
    const startResizingRight = () => {
      rightResizing.current = true;
      document.body.style.cursor = 'col-resize';
    };
  
    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);
  return (
    <div className="flex flex-col h-screen font-sans overflow-clip">
      <div className="w-full z-10">{/* <Header /> */}</div>
      <div className="flex flex-1 min-h-0 relative">
        <Image
          alt="Background gradient"
          fill
          src="/assets/images/image_bg10.png"
          className="absolute inset-0 object-cover -z-10" // Added inset-0 and -z-10
          priority
          quality={100}
        />
        {/* Left Sidebar ------------------------------------------------------------------- */}
        {/* -------------------------------------------------------------------------------- */}

        <SidebarLeft onItemSelect={handleInstrumentSelect} />

        {/* Center content ------------------------------------------------------------------- */}


        <main className="flex-1 min-w-0 text-white">
          <MainContent selectedInstrument={selectedInstrument} />
        </main>


        {/* Right Sidebar ------------------------------------------------------------------- */}

        {/* Right Resizer */}
        <div
          onMouseDown={startResizingRight}
          className="w-1 cursor-col-resize bg-[var(--border-color)]"
        />
        <aside
          className={`bg-[var(--bg-sidebar)] border-l max-w-[50%] border-[var(--border-color)] flex justify-end hover:bg-[var(--accent)] ${!setIsRightCollapsed ? 'min-w-[${minRightWidth}]' : 'min-w-0' } transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] border-l border-[var(--border)]`}
          style={{ width: `${rightWidth}px`}}
        >
          <SidebarRight setRightWidth={setRightWidth} setIsRightCollapsed={setIsRightCollapsed} />
        </aside>
        
        {/* ---------------------------------------------------------------------------------- */}
        {/* ---------------------------------------------------------------------------------- */}
      </div>
    </div>
  );
}
