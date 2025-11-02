import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

async function getMatches(fid: number) {
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      user1:users!matches_fid_1_fkey(fid, display_name, pfp_url, bio),
      user2:users!matches_fid_2_fkey(fid, display_name, pfp_url, bio)
    `)
    .or(`fid_1.eq.${fid},fid_2.eq.${fid}`)
    .order('matched_at', { ascending: false })

  return matches || []
}

export default async function MatchesPage() {
  let user
  try {
    user = await getCurrentUser()
  } catch (error) {
    redirect('/')
  }

  if (!user) {
    redirect('/')
  }

  const matches = await getMatches(user.fid)

  return (
    <main className="min-h-screen bg-base-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-base-black mb-6">Your Matches</h1>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No matches yet</p>
            <Link
              href="/discover"
              className="text-base-blue hover:underline"
            >
              Start swiping to find matches
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match: any) => {
              const matchedUser = match.fid_1 === user.fid ? match.user2 : match.user1
              
              return (
                <div
                  key={match.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src={matchedUser.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${matchedUser.fid}`}
                    alt={matchedUser.display_name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full bg-gray-200"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base-black">{matchedUser.display_name}</h3>
                    {matchedUser.bio && (
                      <p className="text-sm text-gray-500 line-clamp-1">{matchedUser.bio}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Matched {new Date(match.matched_at).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={`https://warpcast.com/${matchedUser.fid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-base-blue text-base-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Message
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

