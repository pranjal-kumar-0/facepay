import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  // 1. Create the auth-aware Supabase server client
  const supabase = await createClient();

  // 2. Get the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // 3. If no user is logged in, return an unauthorized error
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 4. Query your 'faces' table to see if a record with the user's ID exists
    const { data, error } = await supabase
      .from('faces')
      .select('user_id') // We only need to check for existence, so select any column
      .eq('user_id', user.id)
      .maybeSingle(); // .maybeSingle() returns data if found, or null if not, without erroring

    // Handle any unexpected database errors
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // 5. Return the result
    if (data) {
      // A record was found, so the user has already registered their face
      return NextResponse.json({ exists: true });
    } else {
      // No record was found
      return NextResponse.json({ exists: false });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
