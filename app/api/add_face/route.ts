import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient() 
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  console.log('Authenticated User ID from server:', user.id);

  const { face_embedding, name, upi_id } = await request.json()
  if (!face_embedding) {
    return NextResponse.json({ error: 'Missing face_embedding in request body' }, { status: 400 })
  }
  const newFaceData = {
    user_id: user.id,
    email: user.email,
    face_embedding,
    name,
    upi_id,
  }
  console.log('Attempting to insert this data:', newFaceData);

  const { data, error } = await supabase
    .from('faces')
    .insert(newFaceData)
    .select()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Face data saved.', data })
}