'use client';

import { User, LogOut, Moon } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/store';

const UserInfoCard = () => {
  const { isLeftCollapsed, selectTheme, setSelectTheme } = useStore();

  return (
    <div className="flex p-1.5 border-t border-[var(--border)] pl-3">
      <div
        className={`flex items-center ${
          isLeftCollapsed ? 'justify-center w-full' : 'space-x-2 w-full'
        }`}
      >
        <div
        className={`flex items-center justify-center rounded-full min-h-8 min-w-8 h-8 w-8 ${
            isLeftCollapsed ? 'mx-auto' : 'mr-2'
          } bg-[var(--bg-secondary)]`}
        >
          <User size={16} className="text-[var(--text-muted)]" />
        </div>
        {!isLeftCollapsed && (
          <>
            <span className="text-sm text-[var(--text-primary)] truncate">
              Placeholder Username
            </span>
            <div className="flex-1" />
            <button
              onClick={() => setSelectTheme(!selectTheme)}
              className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              <Moon size={16} className="text-[var(--text-muted)]" />
            </button>
            <Link
              href="/auth/signout"
              className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              <LogOut size={16} className="text-[var(--text-muted)]" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;