'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function SignInButton() {
  const [loading, setLoading] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // SDK is available immediately when running in Farcaster miniapp
    setSdkReady(true)
  }, [])

  async function signIn() {
    if (!sdkReady) {
      setError('SDK not loaded. Please make sure you are running in a Farcaster miniapp.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken()

      // Use the token to authenticate with backend
      const backendOrigin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      const response = await sdk.quickAuth.fetch(`${backendOrigin}/api/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Authentication failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Store token and FID in cookies via backend
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, fid: data.fid }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session')
      }

      // Redirect based on profile completion
      window.location.href = data.redirectUrl || '/discover'
    } catch (error) {
      console.error('Authentication failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to sign in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={signIn}
        disabled={loading || !sdkReady}
        className="w-full bg-base-blue text-base-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? 'Connecting...' : sdkReady ? 'Sign In With Farcaster' : 'Loading...'}
      </button>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

