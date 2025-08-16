"use client";

import { useStore } from "@/store/store";
import { cn } from "@/lib/shadcn/utils";
import { Search, LayoutDashboard, MessageCircle } from "lucide-react";

const MobileNav = () => {
  // Destructure the new state and actions
  const { mobileView, setMobileView, isMobileSearchOpen, toggleMobileSearch } = useStore();

  const navItems = [
    // This item's logic is now different
    { name: "Search", view: "search", icon: Search, action: toggleMobileSearch, isActive: isMobileSearchOpen },
    { name: "Data", view: "data", icon: LayoutDashboard, action: () => setMobileView('data'), isActive: mobileView === 'data' && !isMobileSearchOpen },
    { name: "Chat", view: "chat", icon: MessageCircle, action: () => setMobileView('chat'), isActive: mobileView === 'chat' && !isMobileSearchOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={item.action}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-md transition-colors w-20",
            item.isActive
              ? "text-[var(--primary)]"
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