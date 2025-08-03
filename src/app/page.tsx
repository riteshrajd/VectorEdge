"use client";

import { JSX, useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import { useUserStore } from "@/store/userStore";
import { createClient } from "@/utils/supabase/client";
import { fetchUser } from "@/utils/fetchUser";

export default function Home(): JSX.Element {
  const [isMounted, setIsMounted] = useState(true);

  // Function to handle fetching user data
  const handleFetchUser = async () => {
    const response = await fetchUser(); // Call Server Action
    if (response.success) {
      useUserStore.getState().setUser(response.data!); // Update store with user data
      console.log('User fetched:', response.data);
    } else {
      useUserStore.getState().setUser(null); // Clear store on error
      console.log('Error:', response.error);
    }
  };

  useEffect(() => {
    // Initial fetch
    handleFetchUser();

    // Set up Supabase auth listener
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (isMounted) {
        if (session?.user) {
          handleFetchUser(); // Fetch user when logged in
        } else {
          useUserStore.getState().setUser(null); // Clear user when logged out
          console.log('User logged out');
        }
      }
    });

    // Cleanup on unmount
    return () => {
      setIsMounted(false);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans overflow-clip bg-[var(--bg-main)]">
      <div className="flex flex-1 min-h-0 relative">
        <SidebarLeft />
        <main className="flex-1 min-w-0">
          <MainContent />
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}