import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateSubscriptionStatus } from '@/lib/actions/profile-db-actions';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  console.log(`🌿🌿verify route called`)
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = await request.json();


    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay secret key is not set in .env.local');
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify the signature
    console.log(`💻 1. verify the signature`)
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
    
    // 2. Payment is authentic, update user's subscription via action
    console.log(`😁 2. payment is authentic`)
    const { success, error } = await updateSubscriptionStatus(true, plan, user.id);
    
    if (!success) {
      // The action already logs the detailed error.
      throw new Error(error || 'Failed to update subscription status.');
    }
    
    console.log(`✅ 3. response sent successfully`)
    return NextResponse.json({ success: true, message: 'Payment verified and subscription updated.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
