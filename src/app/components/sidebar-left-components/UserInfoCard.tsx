'use client';

import { Crown, LogOut } from 'lucide-react';
import { useStore } from '@/store/store';
import ThemeToggle from '@/components/ThemeToggle';
import { useUserStore } from '@/store/userStore';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const UserInfoCard = () => {
  const { isLeftCollapsed } = useStore();
  const userStore = useUserStore();
  const user = userStore.user;
  const supabase = createClient();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Function to get first letter and a consistent background color based on name
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
    redirect('/login');
  };

  return (
    <>
      <div className="flex border-t-2 mt-2 border-sidebar-border px-3 py-1.5">
        <div
          className={`flex items-center ${
            isLeftCollapsed ? 'justify-center w-full' : 'space-x-2 w-full'
          }`}
        >
          <Link href="/profile" title="View Profile">
            <div
              className={`flex items-center justify-center rounded-full min-h-8 min-w-8 h-8 w-8 transition-all duration-300 ${
                isLeftCollapsed ? 'mx-auto' : 'mr-2'
              } ${user?.avatar_url ? '' : colorClass} ${
                // This adds the yellow ring for paid members
                user?.is_paid_member ? 'ring-2 ring-offset-2 ring-offset-sidebar ring-yellow-600' : ''
              }`}
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
          </Link>
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
              <div className='p-1 hover:bg-sidebar-accent rounded-lg transition-colors' title='Light/Dark Mode'>
                <ThemeToggle />
              </div>
              <button
                onClick={() => setShowSignOutConfirm(true)} // Open confirmation modal
                className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors hover:cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} className="text-sidebar-accent-foreground" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed h-screen w-[100dvw] inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-foreground">Confirm Sign Out</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-red-foreground hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfoCard;
