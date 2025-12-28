import { NextResponse } from 'next/server';
import { cancelSubscription } from '@/lib/actions/profile-db-actions';
import { createClient } from '@/utils/supabase/server';

// Removed 'request' parameter to fix the lint warning
export async function POST() {
  console.log(`❌ Cancel subscription route called`);
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the action to update the database
    const { success, error } = await cancelSubscription(user.id);

    if (!success) {
      throw new Error(error || 'Failed to cancel subscription.');
    }

    console.log(`✅ Subscription cancelled successfully via API`);
    return NextResponse.json({ success: true, message: 'Subscription cancelled successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Cancel subscription error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}