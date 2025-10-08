import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('faces')
      .select('user_id') 
      .eq('user_id', user.id)
      .maybeSingle(); 

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    if (data) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
