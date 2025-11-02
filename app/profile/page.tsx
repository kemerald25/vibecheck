import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('fid', user.fid)
    .single()

  if (!userData) {
    redirect('/onboarding')
  }

  return (
    <main className="min-h-screen bg-base-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-base-black mb-6">Edit Profile</h1>
        <ProfileForm initialData={userData} />
      </div>
    </main>
  )
}

