"use client";

import { JSX, useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import AIChat from "./components/AIChat";
import MobileNav from "./components/MobileNav";
import { useStore } from "@/store/store";
import { useUserStore } from "@/store/userStore";
import { createClient } from "@/utils/supabase/client";
import { fetchUser } from "@/services/fetchUser";
import { ChevronRight } from "lucide-react";
import { useBreakpoint } from "./hooks/useBreakpoint";


// --- Step 2: The Desktop Layout Component ---
const DesktopLayout = () => {
  const [chatOn, setChatOn] = useState(false);
  const handleChatClick = () => setChatOn(!chatOn);

  return (
    <div className="flex flex-col h-screen w-screen font-sans overflow-clip bg-[var(--bg-main)] relative">
      <div className="flex flex-1 min-h-0 relative">
        <SidebarLeft />
        <main className="flex-1 min-w-0">
          <MainContent />
        </main>
      </div>
      <button
        onClick={handleChatClick}
        className={`absolute h-[46px] w-[32px] bottom-10 right-[40px] text-white bg-red-600 z-1 hover:cursor-pointer ease-in-out duration-400 ${chatOn ? '-translate-x-102' : 'translate-x-[40px]' } flex flex-col justify-center items-center`}
      >
        <ChevronRight className={`${chatOn ? '' : 'hidden'}`}/>
        <p className={`text-sm ${chatOn ? 'hidden' : ''}`}>Ask</p>
        <p className={`text-sm ${chatOn ? 'hidden' : ''}`}>AI</p>
      </button>

      {/* AI-chat */}
      <div className={`absolute h-full w-112 bg-transparent transition-transform duration-400 ease-in-out transform top-0 right-0 z-5 ${chatOn ? 'translate-x-0' : 'translate-x-full'}`}>
        <AIChat />
      </div>
    </div>
  );
};


// --- Step 3: The Mobile Layout Component ---
const MobileLayout = () => {
  const { mobileView } = useStore();
  const [chatOn, setChatOn] = useState(mobileView==='chat');
  useEffect(() => {setChatOn(mobileView==='chat')}, [mobileView]);

  return (
    <div className="flex flex-col h-[100dvh] w-screen font-sans bg-[var(--bg-main)] relative pb-14">
      <div className="flex flex-col flex-1 w-screen font-sans overflow-clip bg-[var(--bg-main)] relative">
        <div className={`flex flex-1 h-full absolute min-h-0 transition-transform duration-300 ${mobileView==='search' ? 'translate-x-0' : '-translate-x-62'}`}>
          <div className="flex">
            <SidebarLeft />
          </div>
          <main className="flex-1 w-screen min-w-0">
            <MainContent />
          </main>
        </div>
        {/* AI-chat */}
        <div className={`absolute h-full max-w-full w-screen bg-transparent transition-transform duration-400 ease-in-out transform top-0 right-0 z-5 ${chatOn ? 'translate-x-0' : 'translate-x-full'}`}>
          <AIChat />
        </div>
      </div>
      <MobileNav />
    </div>
  );
};


// --- Step 4: The Main Home Component ---
export default function Home(): JSX.Element {
  const isMobile = useBreakpoint();
  useEffect(() => {
      useStore.getState().setIsMobile(isMobile);
    }, [isMobile]); // This effect runs only when `isMobile` changes

  // This user fetching logic remains here as it's needed for both layouts
  useEffect(() => {
    const handleFetchUser = async () => {
      const response = await fetchUser();
      if (response.success) {
        useUserStore.getState().setUser(response.data!);
      } else {
        useUserStore.getState().setUser(null);
        console.log("Error:", response.error);
      }
    };

    handleFetchUser();

    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          handleFetchUser();
        } else {
          useUserStore.getState().setUser(null);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Conditionally render the correct layout based on the screen size
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}