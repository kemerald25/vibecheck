'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function SignInButton() {
  const [loading, setLoading] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    // SDK is available immediately when running in Farcaster miniapp
    setSdkReady(true)
  }, [])

  async function signIn() {
    if (!sdkReady) {
      alert('SDK not loaded. Please make sure you are running in a Farcaster miniapp.')
      return
    }

    setLoading(true)
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken()

      // Use the token to authenticate with backend
      const backendOrigin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const response = await sdk.quickAuth.fetch(`${backendOrigin}/api/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const data = await response.json()

      // Store token and FID in cookies via backend
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, fid: data.fid }),
      })

      // Redirect based on profile completion
      window.location.href = data.redirectUrl || '/discover'
    } catch (error) {
      console.error('Authentication failed:', error)
      alert('Failed to sign in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={signIn}
      disabled={loading || !sdkReady}
      className="w-full bg-base-blue text-base-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
    >
      {loading ? 'Connecting...' : sdkReady ? 'Sign In With Farcaster' : 'Loading...'}
    </button>
  )
}

