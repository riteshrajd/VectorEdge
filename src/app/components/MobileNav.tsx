"use client";

import { useStore } from "@/store/store";
import { cn } from "@/lib/shadcn/utils";
import { Search, LayoutDashboard, MessageCircle } from "lucide-react";

const MobileNav = () => {
  const { mobileView, setMobileView } = useStore();

  const navItems = [
    { name: "Search", view: "search", icon: Search },
    { name: "Data", view: "data", icon: LayoutDashboard },
    { name: "Chat", view: "chat", icon: MessageCircle },
  ];

  // This handler now contains the correct logic
  const handleItemClick = (view: 'search' | 'data' | 'chat') => {
    // If the user taps the currently active icon (and it's not 'data'),
    // it will toggle back to the default 'data' view.
    if (useStore.getState().mobileView === view && view !== 'data') {
      setMobileView('data');
    } else {
      // Otherwise, it just switches to the selected view.
      setMobileView(view);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-[var(--border)] flex justify-around items-center z-40">
      {navItems.map((item) => (
        <button
          key={item.view}
          // The onClick now calls the correct handler with the correct type.
          onClick={() => handleItemClick(item.view as 'search' | 'data' | 'chat')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-md transition-colors w-20",
            mobileView === item.view
              ? "text-[var(--primary)]" // Using a simple color change for the active state is cleaner.
              : "text-[var(--text-muted-foreground)] hover:bg-[var(--bg-hover)]"
          )}
        >
          <item.icon size={20} />
          <span className="text-xs font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;