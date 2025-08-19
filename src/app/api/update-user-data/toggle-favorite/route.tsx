import { toggleFavourite } from "@/lib/actions/profile-db-actions";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log(`addToFavourite called with ${request.body}`)
  const { symbol } = await request.json();
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  if(symbol === '' || !symbol){
    return new Response(JSON.stringify({ message: 'Invalid symbol' }), { status: 400 });
  };
  
  const response = await toggleFavourite(user.id, symbol);

  if(!response) {
    return new Response(JSON.stringify({ message: 'Failed to add to favourite.' }), { status: 500 })
  }
  return new Response(JSON.stringify(response), { status: 200 });
}
