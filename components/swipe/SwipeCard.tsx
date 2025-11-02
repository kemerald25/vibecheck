'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { User } from '@/lib/db/types'

interface SwipeCardProps {
  user: User
  onSwipe: (action: 'yes' | 'maybe' | 'skip') => void
  offset: { x: number; y: number }
}

export function SwipeCard({ user, onSwipe, offset }: SwipeCardProps) {
  const recentCast = user.recent_casts?.[0]

  return (
    <motion.div
      className="absolute inset-0 bg-base-white rounded-2xl shadow-xl p-6 flex flex-col"
      style={{ x: offset.x, y: offset.y, rotate: offset.x * 0.1 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe(info.offset.x > 0 ? 'yes' : 'skip')
        }
      }}
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-4">
          <Image
            src={user.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fid}`}
            alt={user.display_name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full bg-gray-200"
            unoptimized
          />
          <div>
            <h3 className="text-xl font-bold text-base-black">{user.display_name}</h3>
            <p className="text-sm text-gray-500">
              {user.space === 'builder' ? '🔨 Builder' : '🎨 Creator'}
            </p>
          </div>
        </div>

        <p className="text-gray-700">{user.bio}</p>

        {recentCast && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-2">
              {recentCast.text || recentCast.content}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {user.tags?.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-base-blue/10 text-base-blue text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {user.skills?.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

