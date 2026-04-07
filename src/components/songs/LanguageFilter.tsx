import { LANGUAGE_LABELS, LANGUAGES } from '@/constants/keys'
import type { Language } from '@/types'

interface LanguageFilterProps {
  value: Language | 'all'
  onChange: (v: Language | 'all') => void
  counts: Record<Language | 'all', number>
}

export function LanguageFilter({ value, onChange, counts }: LanguageFilterProps) {
  const tabs: { key: Language | 'all'; label: string }[] = [
    { key: 'all', label: 'Todas' },
    ...LANGUAGES.map((l) => ({ key: l as Language | 'all', label: LANGUAGE_LABELS[l] })),
  ]

  return (
    <div className="flex gap-1 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            value === tab.key
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-100'
          }`}
        >
          {tab.label}
          <span className="ml-1.5 text-xs opacity-60">{counts[tab.key]}</span>
        </button>
      ))}
    </div>
  )
}
