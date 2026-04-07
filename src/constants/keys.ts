import type { Language, MusicalKey } from '@/types'

export const MUSICAL_KEYS: MusicalKey[] = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E',
  'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
  'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em',
  'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm',
]

export const LANGUAGES: Language[] = ['English', 'Spanish', 'Tagalog']

export const LANGUAGE_LABELS: Record<Language, string> = {
  English: 'English',
  Spanish: 'Español',
  Tagalog: 'Tagalog',
}

export const LANGUAGE_COLORS: Record<Language, string> = {
  English: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Spanish: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Tagalog: 'bg-green-500/20 text-green-300 border border-green-500/30',
}
