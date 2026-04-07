import { LANGUAGE_COLORS, LANGUAGE_LABELS } from '@/constants/keys'
import type { Language } from '@/types'

export function Badge({ language }: { language: Language }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LANGUAGE_COLORS[language]}`}>
      {LANGUAGE_LABELS[language]}
    </span>
  )
}
