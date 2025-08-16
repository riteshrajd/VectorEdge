'use client';

import { Crown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/store';
import ThemeToggle from '@/components/ThemeToggle';
import { useUserStore } from '@/store/userStore';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';

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
    // This will open a confirmation dialog
    if (window.confirm("Are you sure you want to sign out?")) {
      await supabase.auth.signOut();
      userStore.setUser(null);
      redirect('/login');
    }
  };

  return (
    <div className="flex border-t border-sidebar-border px-3 py-1.5">
      <div
        className={`flex items-center ${
          isLeftCollapsed ? 'justify-center w-full' : 'space-x-2 w-full'
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-full min-h-8 min-w-8 h-8 w-8 transition-all duration-300 ${
            isLeftCollapsed ? 'mx-auto' : 'mr-2'
          } ${user?.avatar_url ? '' : colorClass} ${user?.is_paid_member ? 'ring-2 ring-offset-2 ring-offset-sidebar ring-yellow-600' : ''}`}
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
            <span className="text-sm font-medium select-none text-white dark:text-black">{firstLetter}</span>
          )}
        </div>
        {!isLeftCollapsed && (
          <>
            <div className="flex items-center space-x-1.5 select-none flex-shrink min-w-0">              
              <span className="text-sm text-sidebar-foreground truncate">
                {user?.full_name || ''}
              </span>
              
              {user?.is_paid_member && (
                <div title="Premium Member" className="flex-shrink-0">
                  <Crown size={14} className="text-yellow-600" />
                </div>
              )}
            </div>
            <div className="flex-1" /> 
            <div className='p-1 hover:bg-sidebar-accent rounded-lg transition-colors'>
              <ThemeToggle />
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} className="text-sidebar-accent-foreground" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;