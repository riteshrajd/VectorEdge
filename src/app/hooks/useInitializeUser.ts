'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { fetchUser } from '@/services/fetchUser';
import { createClient } from '@/utils/supabase/client';

/**
 * A custom hook to initialize the user state. It fetches the current user
 * and sets up a listener for authentication changes (login/logout).
 */
export const useInitializeUser = () => {
  useEffect(() => {
    // Define the function to fetch user data and update the Zustand store.
    const handleFetchUser = async () => {
      const response = await fetchUser();
      if (response.success) {
        useUserStore.getState().setUser(response.data!);
      } else {
        useUserStore.getState().setUser(null);
        console.error("Initialization Error:", response.error);
      }
    };

    // Fetch the user immediately on component mount.
    handleFetchUser();

    // Set up a listener for real-time authentication changes.
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

    // Return a cleanup function to unsubscribe from the listener
    // when the component unmounts. This prevents memory leaks.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // The empty dependency array ensures this runs only once.
};