'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Space, LookingForTag } from '@/lib/db/types'

const LOOKING_FOR_TAGS: LookingForTag[] = ['co-founder', 'freelancer', 'collab', 'advice']

interface ProfileFormData {
  display_name: string
  bio: string
  space: Space | ''
  tags: LookingForTag[]
  skills: string[]
  availability: string
  portfolio_links: string[]
}

export function ProfileForm({ initialData }: { initialData?: Partial<ProfileFormData> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState('')

  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: initialData?.display_name || '',
    bio: initialData?.bio || '',
    space: initialData?.space || '',
    tags: initialData?.tags || [],
    skills: initialData?.skills || [],
    availability: initialData?.availability || '',
    portfolio_links: initialData?.portfolio_links || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.display_name || !formData.bio || !formData.space) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.bio.length > 150) {
      setError('Bio must be 150 characters or less')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      router.push('/discover')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const toggleTag = (tag: LookingForTag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-base-black">Create Your Profile</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          Display Name *
        </label>
        <input
          type="text"
          value={formData.display_name}
          onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-blue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          Bio (150 chars max) *
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          maxLength={150}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-blue"
          required
        />
        <p className="text-sm text-gray-500 mt-1x">
          {formData.bio.length}/150
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          I am a *
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, space: 'builder' }))}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
              formData.space === 'builder'
                ? 'bg-base-blue text-base-white border-base-blue'
                : 'bg-base-white text-base-black border-gray-300 hover:border-base-blue'
            }`}
          >
            🔨 Builder
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, space: 'creator' }))}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-colors ${
              formData.space === 'creator'
                ? 'bg-base-blue text-base-white border-base-blue'
                : 'bg-base-white text-base-black border-gray-300 hover:border-base-blue'
            }`}
          >
            🎨 Creator
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          Looking For *
        </label>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                formData.tags.includes(tag)
                  ? 'bg-base-blue text-base-white border-base-blue'
                  : 'bg-base-white text-base-black border-gray-300 hover:border-base-blue'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          Skills (optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill()
              }
            }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-blue"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-base-blue text-base-white rounded-lg hover:opacity-90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map(skill => (
            <span
              key={skill}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-base-black mb-1x">
          Availability (optional)
        </label>
        <input
          type="text"
          value={formData.availability}
          onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          placeholder="e.g., Available for projects, Looking for co-founder..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-base-blue"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-base-blue text-base-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? 'Saving...' : 'Create Profile'}
      </button>
    </form>
  )
}

