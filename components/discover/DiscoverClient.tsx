'use client'

import { useState, useCallback } from 'react'
import { SwipeCard } from '@/components/swipe/SwipeCard'
import { SwipeActions } from '@/components/swipe/SwipeActions'
import type { User } from '@/lib/db/types'

const DAILY_SWIPE_LIMIT = 20

interface DiscoverClientProps {
  initialUsers: User[]
  currentFid: number
  swipeCount: number
}

export function DiscoverClient({ initialUsers, currentFid, swipeCount }: DiscoverClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showMatch, setShowMatch] = useState<{ name: string } | null>(null)

  const handleSwipe = useCallback(async (action: 'yes' | 'maybe' | 'skip') => {
    if (loading || swipeCount >= DAILY_SWIPE_LIMIT) return

    const currentUser = users[currentIndex]
    if (!currentUser) return

    setLoading(true)

    try {
      // Optimistic update
      setOffset({ x: 0, y: 0 })
      setCurrentIndex(prev => prev + 1)

      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swiped_fid: currentUser.fid,
          action,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save swipe')
      }

      const data = await response.json()

      // Check for match
      if (data.match) {
        setShowMatch({ name: currentUser.display_name })
      }
    } catch (error) {
      console.error('Swipe error:', error)
      // Revert optimistic update
      setCurrentIndex(prev => Math.max(0, prev - 1))
    } finally {
      setLoading(false)
    }
  }, [currentIndex, users, loading, swipeCount])

  const currentUser = users[currentIndex]
  const remainingSwipes = DAILY_SWIPE_LIMIT - swipeCount
  const hasReachedLimit = swipeCount >= DAILY_SWIPE_LIMIT

  return (
    <>
      {showMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-white rounded-2xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-base-black mb-2">It&apos;s a Match!</h2>
            <p className="text-gray-600 mb-6">
              You and {showMatch.name} both swiped yes!
            </p>
            <button
              onClick={() => setShowMatch(null)}
              className="px-6 py-3 bg-base-blue text-base-white rounded-lg font-semibold hover:opacity-90"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-base-black">Discover</h1>
          <p className="text-sm text-gray-500">
            {remainingSwipes} swipes remaining today
          </p>
        </div>

        <div className="flex-1 relative p-4">
          {currentUser && !hasReachedLimit ? (
            <>
              <div className="relative w-full h-[600px]">
                <SwipeCard
                  user={currentUser}
                  onSwipe={handleSwipe}
                  offset={offset}
                />
              </div>
              <SwipeActions onAction={handleSwipe} disabled={loading} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  {hasReachedLimit
                    ? "You&apos;ve reached your daily swipe limit!"
                    : 'No more profiles to show'}
                </p>
                <p className="text-gray-500">
                  Come back tomorrow for more matches
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
