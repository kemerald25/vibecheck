'use client'

interface SwipeActionsProps {
  onAction: (action: 'yes' | 'maybe' | 'skip') => void
  disabled?: boolean
}

export function SwipeActions({ onAction, disabled }: SwipeActionsProps) {
  return (
    <div className="flex gap-4 justify-center items-center p-6">
      <button
        onClick={() => onAction('skip')}
        disabled={disabled}
        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-200 transition-colors"
      >
        ⏭️ Skip
      </button>
      <button
        onClick={() => onAction('maybe')}
        disabled={disabled}
        className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg font-semibold disabled:opacity-50 hover:bg-yellow-200 transition-colors"
      >
        💭 Maybe
      </button>
      <button
        onClick={() => onAction('yes')}
        disabled={disabled}
        className="px-6 py-3 bg-base-blue text-base-white rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        🔥 Hell Yes
      </button>
    </div>
  )
}

