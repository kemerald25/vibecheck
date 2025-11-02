import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const fid = cookieStore.get('fid')?.value

  if (!fid) {
    return null
  }

  return {
    fid: Number(fid),
    signer_uuid: `quick-auth-${fid}`, // Quick Auth doesn't use signer_uuid
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

