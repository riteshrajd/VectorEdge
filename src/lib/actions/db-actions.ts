'use server'
import { createClient } from '@/utils/supabase/server';
import { InstrumentCoverInfo } from '@/types/types';

export async function addInstrumentToHistory(userId: string, instrument: InstrumentCoverInfo) {
  const supabase = await createClient();

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('instrument_history')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) {
    return null;
  }

  const currentHistory: InstrumentCoverInfo[] = profile.instrument_history || [];
  const updatedHistory = [
    instrument,
    ...currentHistory.filter((item) => item.symbol !== instrument.symbol),
  ];

  const { data, error } = await supabase
    .from('profiles')
    .update({ instrument_history: updatedHistory })
    .eq('id', userId)
    .select('instrument_history')
    .single();

  if (error || !data) {
    return null;
  }
  console.log(`instrumet history updated in the backend for user ${userId}, new history is ${updatedHistory}`)

  return data.instrument_history;
}

export async function toggleFavourite(userId: string, symbol: string) {
  const supabase = await createClient();

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('instrument_history')
    .eq('id', userId)
    .single();

  if(fetchError || !profile){
    return null;
  }

  const currentHistory: InstrumentCoverInfo[] = profile.instrument_history || [];
  const updatedHistory = currentHistory.map((item) => 
    item.symbol === symbol 
      ? { ...item, isFavorite: !item.isFavorite }
      : item
  );

  const { data, error } = await supabase
    .from('profiles')
    .update({ instrument_history: updatedHistory })
    .eq('id', userId)
    .select('instrument_history')
    .single();

  if (error || !data) {
    return null;
  }

  return true;
}

export async function updateSubscriptionStatus(status: boolean, planType: string, userId: string) {
  const supabase = await createClient();


  const expiryDate = new Date();
  if (planType === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else if (planType === 'yearly') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else {
    return { success: false, error: 'Invalid subscription plan provided.' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      is_paid_member: status,
      subscription_plan: 'plus', // Set the plan tier, e.g., 'plus'
      subscription_expiry: expiryDate.toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating subscription for user ${userId}:`, error);
    return { success: false, error: error.message };
  }

  console.log(`✅ Subscription status updated for user ${userId} to ${status}`);
  return { success: true, data };
}