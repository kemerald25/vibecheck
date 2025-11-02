import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { DiscoverClient } from '@/components/discover/DiscoverClient'

async function getDiscoverableUsers(currentFid: number) {
  // Get user's space to filter by opposite space (or same if preferred)
  const { data: currentUser } = await supabase
    .from('users')
    .select('space')
    .eq('fid', currentFid)
    .single()

  // Get already swiped users
  const { data: swipes } = await supabase
    .from('swipes')
    .select('swiped_fid')
    .eq('swiper_fid', currentFid)

  const swipedFids = swipes?.map((s: any) => s.swiped_fid) || []

  // Get users in opposite space (or all if no preference)
  const spaceFilter = currentUser?.space === 'builder' ? 'creator' : 'builder'
  
  let query = supabase
    .from('users')
    .select('*')
    .eq('space', spaceFilter)
    .neq('fid', currentFid)

  if (swipedFids.length > 0) {
    query = query.not('fid', 'in', `(${swipedFids.join(',')})`)
  }

  const { data, error } = await query.limit(20)

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data || []
}

async function getSwipeCount(currentFid: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('swipes')
    .select('*', { count: 'exact', head: true })
    .eq('swiper_fid', currentFid)
    .gte('created_at', today.toISOString())

  return count || 0
}

export default async function DiscoverPage() {
  let user
  try {
    user = await getCurrentUser()
  } catch (error) {
    redirect('/')
  }

  if (!user) {
    redirect('/')
  }

  const users = await getDiscoverableUsers(user.fid)
  const swipeCount = await getSwipeCount(user.fid)

  return (
    <main className="min-h-screen bg-base-white pb-20">
      <DiscoverClient initialUsers={users} currentFid={user.fid} swipeCount={swipeCount} />
    </main>
  )
}

