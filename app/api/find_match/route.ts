import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const MATCH_THRESHOLD = 0.92; 

export async function POST(request: Request) {
  const { face_embedding } = await request.json();

  if (!face_embedding) {
    return NextResponse.json({ error: 'Missing face_embedding in request body' }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.rpc('match_face', {
    query_embedding: face_embedding,
    match_threshold: MATCH_THRESHOLD,
  });

  if (error) {
    console.error('Error matching face:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  
  if (data && data.length > 0) {
    return NextResponse.json({ success: true, user: data[0] });
  } else {
    return NextResponse.json({ success: false, message: 'No matching user found.' });
  }
}