import { Undo2, Redo2, Check } from 'lucide-react'

interface ActionButtonsProps {
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  saveLabel?: string
  saveDisabled?: boolean
  saveVariant?: 'blue' | 'green'
  isLoading?: boolean
}

export function ActionButtons({
  onUndo,
  onRedo,
  onSave,
  saveLabel = 'Save Changes',
  saveDisabled = false,
  saveVariant = 'blue',
  isLoading = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Undo"
        >
          <Undo2 className="w-5 h-5 text-gray-600" />
        </button>
      )}
      {onRedo && (
        <button
          type="button"
          onClick={onRedo}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Redo"
        >
          <Redo2 className="w-5 h-5 text-gray-600" />
        </button>
      )}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={saveDisabled || isLoading}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
            saveVariant === 'green'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Check className="w-4 h-4" />
          {isLoading ? 'Saving...' : saveLabel}
        </button>
      )}
    </div>
  )
}
