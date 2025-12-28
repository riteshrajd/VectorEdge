'use client';

import { useState } from 'react'; // Added useState
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Crown, 
  User, 
  Mail, 
  Calendar,
  CreditCard,
  History,
  Star,
  Badge,
  XCircle // Added Icon
} from 'lucide-react';
import { Button } from '@/components/shadcn/ui/button';
import Image from 'next/image';
import { useInitializeUser } from '../hooks/useInitializeUser';

const ProfilePage = () => {
  const router = useRouter();
  useInitializeUser();
  const { user } = useUserStore();
  const [isCanceling, setIsCanceling] = useState(false); // Added state

  // Added Cancel Function
  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription?\n\nYou will lose your Premium benefits immediately."
    );

    if (!confirmed) return;

    setIsCanceling(true);

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Reload the page to refresh server data and update UI
        window.location.reload();
      } else {
        alert(data.error || "Failed to cancel subscription.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  // Loading State - Styled to match the theme
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-neutral-950 text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-neutral-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Fallback for avatar
  const getAvatarFallback = (fullName: string) => {
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get subscription badge styling - Adapted for Light/Dark Theme
  const getSubscriptionBadge = () => {
    if (user.is_paid_member) {
      return {
        icon: Crown,
        text: user.subscription_plan || 'Premium',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-500/10',
        borderColor: 'border-amber-200 dark:border-amber-500/20'
      };
    }
    return {
      icon: User,
      text: 'Free Plan',
      color: 'text-gray-500 dark:text-neutral-400',
      bgColor: 'bg-gray-100 dark:bg-white/5',
      borderColor: 'border-gray-200 dark:border-white/10'
    };
  };

  const subscriptionBadge = getSubscriptionBadge();
  const SubscriptionIcon = subscriptionBadge.icon;

  return (
    // Main Container: Light (gray-50) / Dark (neutral-950)
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* Sticky Header 
        - Light: White with blur, gray border
        - Dark: Black tint with blur, white-alpha border
      */}
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </Button>
              {/* Text Gradient adapts to theme */}
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
                My Profile
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        {/* Profile Header Card */}
        {/* Light: White bg, shadow-sm, gray border */}
        {/* Dark: Glassmorphism, shadow-2xl, white-alpha border */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-sm dark:shadow-2xl mb-8 relative overflow-hidden transition-all duration-300">
         
          {/* Background Glows (Subtle in light mode, prominent in dark) */}
          <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-100">
            <div className="absolute top-0 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 -right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
          </div>
         
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
             
              {/* Avatar */}
              <div className="relative">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="User avatar"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-200 dark:border-white/20 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-gray-700 dark:text-white text-2xl font-bold border border-gray-200 dark:border-white/10 shadow-xl">
                    {getAvatarFallback(user.full_name)}
                  </div>
                )}
                {user.is_paid_member && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-neutral-950">
                    <Crown size={16} className="text-white fill-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{user.full_name}</h2>
                <p className="text-gray-500 dark:text-neutral-400 text-lg mb-4 flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
              
                {/* Subscription Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md ${subscriptionBadge.bgColor} ${subscriptionBadge.borderColor}`}>
                  <SubscriptionIcon size={14} className={subscriptionBadge.color} />
                  <span className={`text-sm font-semibold ${subscriptionBadge.color}`}>
                    {subscriptionBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         
          {/* Account Information Card */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10">
                <Badge size={20} className="text-gray-700 dark:text-neutral-200" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-200">Account Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                <span className="text-gray-500 dark:text-neutral-400">User ID</span>
                <code className="text-xs bg-gray-100 dark:bg-black/30 px-2 py-1 rounded font-mono text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-white/5">{user.id}</code>
              </div>
            
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                <span className="text-gray-500 dark:text-neutral-400">Full Name</span>
                <span className="font-medium text-gray-900 dark:text-neutral-200">{user.full_name}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                <span className="text-gray-500 dark:text-neutral-400">Email Address</span>
                <span className="font-medium text-gray-900 dark:text-neutral-200">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500 dark:text-neutral-400">Member Since</span>
                <span className="font-medium text-gray-900 dark:text-neutral-200">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Details Card */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10">
                <CreditCard size={20} className="text-gray-700 dark:text-neutral-200" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-200">Subscription</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                <span className="text-gray-500 dark:text-neutral-400">Current Plan</span>
                <div className="flex items-center gap-2">
                  <SubscriptionIcon size={16} className={subscriptionBadge.color} />
                  <span className={`font-semibold ${subscriptionBadge.color}`}>
                    {user.subscription_plan || subscriptionBadge.text}
                  </span>
                </div>
              </div>
            
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                <span className="text-gray-500 dark:text-neutral-400">Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_paid_member ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500'}`}></div>
                  <span className={`font-semibold ${user.is_paid_member ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {user.is_paid_member ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {user.is_paid_member && user.subscription_expiry && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
                  <span className="text-gray-500 dark:text-neutral-400">Next Billing</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400 dark:text-neutral-500" />
                    <span className="font-medium text-gray-900 dark:text-neutral-200">
                      {formatDate(user.subscription_expiry)}
                    </span>
                  </div>
                </div>
              )}

              {/* Upgrade Button for Free Users */}
              {!user.is_paid_member && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 dark:text-neutral-400">Upgrade Available</span>
                  <Button size="sm" variant="outline" className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-neutral-200" onClick={() => router.push('/subscription')}>
                    <Star size={14} className="mr-1" />
                    Upgrade Now
                  </Button>
                </div>
              )}

              {/* Cancel Button for Paid Users (ADDED THIS SECTION) */}
              {user.is_paid_member && (
                <div className="flex justify-between items-center py-3 pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
                  <span className="text-gray-500 dark:text-neutral-400">Manage Plan</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    disabled={isCanceling}
                    onClick={handleCancelSubscription}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {isCanceling ? (
                      <span className="flex items-center">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Canceling...
                      </span>
                    ) : (
                      <>
                        <XCircle size={14} className="mr-1.5" />
                        Cancel Subscription
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instrument History Card */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10">
                <History size={20} className="text-gray-700 dark:text-neutral-200" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-200">Instrument History</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-neutral-500">
              {user.instrument_history?.length || 0} instruments
            </span>
          </div>

          {user.instrument_history && user.instrument_history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.instrument_history.slice(0, 6).map((instrument, index) => (
                <div key={index} className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-default">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm text-gray-900 dark:text-neutral-200">
                      {typeof instrument === 'object' ? instrument.name || instrument.symbol : instrument}
                    </div>
                    {typeof instrument === 'object' && (
                      <div className="space-y-1">
                        {instrument.symbol && (
                          <div className="text-xs text-gray-500 dark:text-neutral-500">
                            <span className="font-medium text-gray-400 dark:text-neutral-400">Symbol:</span> {instrument.symbol}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {user.instrument_history.length > 6 && (
                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-neutral-500 text-sm">
                  +{user.instrument_history.length - 6} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-neutral-500">
              <History size={48} className="mx-auto mb-4 opacity-20" />
              <p>No instrument history available</p>
              <p className="text-sm opacity-60">Start using instruments to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;