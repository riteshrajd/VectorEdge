"use client";

import { JSX, useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import { useUserStore } from "@/store/userStore";
import { createClient } from "@/utils/supabase/client";
import { fetchUser } from "@/services/fetchUser";
import AIChat from "./components/AIChat";
import { ChevronRight } from "lucide-react";

export default function Home(): JSX.Element {

  const [chatOn, setChatOn] = useState(false);

  // Function to handle fetching user data
  const handleFetchUser = async () => {
    const response = await fetchUser(); // Call Server Action
    if (response.success) {
      useUserStore.getState().setUser(response.data!); // Update store with user data
      console.log("User fetched:", response.data);
    } else {
      useUserStore.getState().setUser(null); // Clear store on error
      console.log("Error:", response.error);
    }
  };

  useEffect(() => {
    // Initial fetch
    handleFetchUser();

    // Set up Supabase auth listener
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          handleFetchUser(); // Fetch user when logged in
        } else {
          useUserStore.getState().setUser(null); // Clear user when logged out
          console.log("User logged out");
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleChatClick = () => {
    console.log("Chat button clicked");
    setChatOn(!chatOn);
  };

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
        className={`absolute h-[46px] w-[32px] bottom-10 right-[40px] text-white bg-red-600 z-1 hover:cursor-pointer ease-in-out duration-500 ${chatOn ? '-translate-x-102' : 'translate-x-[40px]' } flex flex-col justify-center items-center`}
      >
        <ChevronRight className={`${chatOn ? '' : 'hidden'}`}/>
        <p className={`text-sm ${chatOn ? 'hidden' : ''}`}>Ask</p>
        <p className={`text-sm ${chatOn ? 'hidden' : ''}`}>AI</p>
      </button>

      {/* AI-chat */}
      <div className={`absolute h-full w-112 bg-transparent transition-transform duration-500 ease-in-out transform top-0 right-0 z-5 ${chatOn ? 'translate-x-0' : 'translate-x-full'}`}>
        <AIChat />
      </div>
    </div>
  );
}
