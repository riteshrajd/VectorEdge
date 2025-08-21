'use client';

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
  Badge
} from 'lucide-react';
import { Button } from '@/components/shadcn/ui/button';
import Image from 'next/image';
import { useInitializeUser } from '../hooks/useInitializeUser';

const ProfilePage = () => {
  const router = useRouter();
  useInitializeUser();
  const { user } = useUserStore();

  // Handle case where user data might still be loading or is null
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Fallback for avatar
  const getAvatarFallback = (fullName: string) => {
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Format subscription expiry date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get subscription badge styling
  const getSubscriptionBadge = () => {
    if (user.is_paid_member) {
      return {
        icon: Crown,
        text: user.subscription_plan || 'Premium',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800'
      };
    }
    return {
      icon: User,
      text: 'Free Plan',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800'
    };
  };

  const subscriptionBadge = getSubscriptionBadge();
  const SubscriptionIcon = subscriptionBadge.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                My Profile
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-card via-card to-accent/5 p-8 rounded-2xl shadow-lg border border-border mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl"></div>
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
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-background shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-background shadow-xl">
                    {getAvatarFallback(user.full_name)}
                  </div>
                )}
                {user.is_paid_member && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-2">{user.full_name}</h2>
                <p className="text-muted-foreground text-lg mb-4 flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
                
                {/* Subscription Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${subscriptionBadge.bgColor} ${subscriptionBadge.borderColor}`}>
                  <SubscriptionIcon size={16} className={subscriptionBadge.color} />
                  <span className={`font-semibold ${subscriptionBadge.color}`}>
                    {subscriptionBadge.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Account Information */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Badge size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Account Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                <span className="text-muted-foreground">User ID</span>
                <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{user.id}</code>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{user.full_name}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                <span className="text-muted-foreground">Email Address</span>
                <span className="font-medium">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Subscription</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                <span className="text-muted-foreground">Current Plan</span>
                <div className="flex items-center gap-2">
                  <SubscriptionIcon size={16} className={subscriptionBadge.color} />
                  <span className={`font-semibold ${subscriptionBadge.color}`}>
                    {user.subscription_plan || subscriptionBadge.text}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_paid_member ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <span className={`font-semibold ${user.is_paid_member ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {user.is_paid_member ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {user.is_paid_member && user.subscription_expiry && (
                <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
                  <span className="text-muted-foreground">Next Billing</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="font-medium">
                      {formatDate(user.subscription_expiry)}
                    </span>
                  </div>
                </div>
              )}

              {!user.is_paid_member && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Upgrade Available</span>
                  <Button size="sm" variant="outline" onClick={() => router.push('/subscription')}>
                    <Star size={14} className="mr-1" />
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instrument History */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <History size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instrument History</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {user.instrument_history?.length || 0} instruments
            </span>
          </div>

          {user.instrument_history && user.instrument_history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.instrument_history.slice(0, 6).map((instrument, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg border border-border/50 hover:bg-muted/80 transition-colors">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm">
                      {typeof instrument === 'object' ? instrument.name || instrument.symbol : instrument}
                    </div>
                    {typeof instrument === 'object' && (
                      <div className="space-y-1">
                        {instrument.symbol && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Symbol:</span> {instrument.symbol}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {user.instrument_history.length > 6 && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground">
                  +{user.instrument_history.length - 6} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History size={48} className="mx-auto mb-4 opacity-50" />
              <p>No instrument history available</p>
              <p className="text-sm">Start using instruments to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;