'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/store';
import ThemeToggle from '@/components/ThemeToggle';
import { useUserStore } from '@/store/userStore';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const UserInfoCard = () => {
  const { isLeftCollapsed } = useStore();
  const userStore = useUserStore();
  const user = userStore.user;
  const supabase = createClient();

  // Function to get first letter, letter color, and background color
  const getAvatarFallback = (fullName: string) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-chart-1 text-sidebar-foreground',
      'bg-chart-2 text-sidebar-foreground',
      'bg-chart-3 text-sidebar-foreground',
      'bg-chart-4 text-sidebar-foreground',
      'bg-chart-5 text-sidebar-foreground',
    ];
    const colorClass = colors[hash % colors.length];
    return { firstLetter, colorClass };
  };

  const { firstLetter, colorClass } = user?.full_name
    ? getAvatarFallback(user.full_name)
    : { firstLetter: '', colorClass: 'bg-sidebar-accent text-sidebar-foreground' };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    userStore.setUser(null);
  };

  return (
    <div className="flex border-t border-sidebar-border px-3 py-1.5">
      <div
        className={`flex items-center ${
          isLeftCollapsed ? 'justify-center w-full' : 'space-x-2 w-full'
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-full min-h-8 min-w-8 h-8 w-8 ${
            isLeftCollapsed ? 'mx-auto' : 'mr-2'
          } ${user?.avatar_url ? '' : colorClass}`}
        >
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt="User avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">{firstLetter}</span>
          )}
        </div>
        {!isLeftCollapsed && (
          <>
            <span className="text-sm text-sidebar-foreground truncate">
              {(user?.full_name)|| ''}
            </span>
            <div className="flex-1" />
            <div className='p-1 hover:bg-sidebar-accent rounded-lg transition-colors'>
              <ThemeToggle />
            </div>
            <Link
              href="/auth/signout"
              onClick={handleSignOut}
              className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <LogOut size={16} className="text-sidebar-accent-foreground" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;