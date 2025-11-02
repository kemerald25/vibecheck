export type Space = 'builder' | 'creator'
export type SwipeAction = 'yes' | 'maybe' | 'skip'
export type LookingForTag = 'co-founder' | 'freelancer' | 'collab' | 'advice'

export interface User {
  fid: number
  signer_uuid: string
  display_name: string
  bio: string | null
  space: Space | null
  tags: LookingForTag[]
  skills: string[]
  availability: string | null
  portfolio_links: string[]
  pfp_url: string | null
  follower_count: number
  recent_casts: any[] | null
  created_at: string
  updated_at: string
}

export interface Swipe {
  id: string
  swiper_fid: number
  swiped_fid: number
  action: SwipeAction
  created_at: string
}

export interface Match {
  id: string
  fid_1: number
  fid_2: number
  matched_at: string
}

export interface NotificationSettings {
  id: string
  fid: number
  notification_token: string | null
  notification_url: string | null
  enabled: boolean
  updated_at: string
}

