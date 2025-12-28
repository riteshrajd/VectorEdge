import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { addInstrumentToHistory } from '@/lib/actions/profile-db-actions';

export async function POST(request: Request) {
  console.log(`update instrument history route called`)
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log(`✅no auth error in the backend`)
  const { instrument } = await request.json();

  if (!instrument || !instrument.symbol || !instrument.name) {
    console.log('**instrument faulty**');
    if(instrument) console.log(JSON.stringify(instrument));
    else console.log('****no instrument****');

    return NextResponse.json({ error: 'Invalid instrument data' }, { status: 400 });
  }

console.log(`✅instrument received in the backend`)
  const updatedHistory = await addInstrumentToHistory(user.id, instrument);

  if (!updatedHistory) {
    return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
  }

  console.log(`✅history updated in the backend`);
  return NextResponse.json({ instrument_history: updatedHistory });
}