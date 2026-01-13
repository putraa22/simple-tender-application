interface StickyNoteProps {
  children: React.ReactNode
}

export function StickyNote({ children }: StickyNoteProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
    </div>
  )
}
