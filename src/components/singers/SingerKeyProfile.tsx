import type { MusicalKey } from '@/types'

interface SingerKeyProfileProps {
  keys: MusicalKey[]
}

export function SingerKeyProfile({ keys }: SingerKeyProfileProps) {
  if (keys.length === 0) return null
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500">Tonos habituales:</span>
      {keys.map((k) => (
        <span
          key={k}
          className="text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full"
        >
          {k}
        </span>
      ))}
    </div>
  )
}
