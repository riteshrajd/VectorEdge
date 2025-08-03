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