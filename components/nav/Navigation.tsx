'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Only show nav on authenticated pages
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      }
    }
    checkAuth()
  }, [])

  // Don't show nav on landing page
  if (pathname === '/' || !isAuthenticated) {
    return null
  }

  const navItems = [
    { href: '/discover', label: 'Discover', icon: '🔍' },
    { href: '/matches', label: 'Matches', icon: '💚' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-base-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center p-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? 'text-base-blue bg-base-blue/10'
                : 'text-gray-600 hover:text-base-black'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

