'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Client-side check (server-side is handled by middleware)
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check')
      if (!response.ok) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  return <>{children}</>
}

