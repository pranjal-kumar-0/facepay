import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddFaceClient from '@/components/add/AddFaceClient';

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return <AddFaceClient />;
}