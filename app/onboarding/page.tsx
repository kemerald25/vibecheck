import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function OnboardingPage() {
  let user
  try {
    user = await getCurrentUser()
  } catch (error) {
    redirect('/')
  }

  if (!user) {
    redirect('/')
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('fid', user.fid)
    .single()

  return (
    <main className="min-h-screen bg-base-white p-4">
      <ProfileForm initialData={existingUser || undefined} />
    </main>
  )
}

