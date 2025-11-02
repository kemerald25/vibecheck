import { SignInButton } from '@/components/auth/SignInButton'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  try {
    const user = await getCurrentUser()

    if (user) {
      redirect('/discover')
    }
  } catch (error) {
    // cookies() is not available in this context, continue to render login page
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-base-black">
          Vibe Check
        </h1>
        <p className="text-lg text-gray-600">
          Find your perfect match on Farcaster. Builders and creators connecting.
        </p>
        <SignInButton />
        <p className="text-sm text-gray-500 mt-4">
          Sign in with your Farcaster account to get started
        </p>
      </div>
    </main>
  )
}
