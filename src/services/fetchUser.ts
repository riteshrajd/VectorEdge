'use server'
import { createClient } from '@/utils/supabase/server';
import { UserData } from '@/types/store-types';

export const fetchUser = async () => {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return {success: false, error: 'No user found'}
    }
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
  
    if (profileError) {
      return {success: false, error: 'failed to get user profile'};
    }
  
    const userData: UserData = {
      id: authUser.id,
      email: profile.email || authUser.email || '',
      full_name: profile.full_name || authUser.user_metadata?.full_name || 'User',
      avatar_url: profile.avatar_url || null,
      instrument_history: profile.instrument_history || [],
      is_paid_member: profile.is_paid_member || false,
      theme: profile.theme || undefined,
    };
  
    return {success: true, data: userData}
  } catch (error) {
    return { success: false, error };
  }
};
