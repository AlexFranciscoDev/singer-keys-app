import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { MUSICAL_KEYS, LANGUAGES, LANGUAGE_LABELS } from '@/constants/keys'
import type { Language, MusicalKey, SingerSongView, Song } from '@/types'

interface SongFormProps {
  songs: Song[]
  existing?: SingerSongView
  onAdd: (title: string, language: Language, key: MusicalKey, notes?: string) => Promise<void>
  onUpdate: (id: string, key: MusicalKey, notes?: string) => Promise<void>
  onClose: () => void
}

export function SongForm({ songs, existing, onAdd, onUpdate, onClose }: SongFormProps) {
  const isEdit = !!existing

  const [title, setTitle] = useState(existing?.songTitle ?? '')
  const [language, setLanguage] = useState<Language>(existing?.language ?? 'Spanish')
  const [key, setKey] = useState<MusicalKey>(existing?.key ?? 'C')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [suggestions, setSuggestions] = useState<Song[]>([])
  const [titleLocked, setTitleLocked] = useState(isEdit)

  useEffect(() => {
    if (isEdit || titleLocked) return
    const q = title.toLowerCase().trim()
    if (!q) { setSuggestions([]); return }
    setSuggestions(
      songs
        .filter((s) => s.title.toLowerCase().includes(q))
        .slice(0, 5),
    )
  }, [title, songs, isEdit, titleLocked])

  function pickSuggestion(s: Song) {
    setTitle(s.title)
    setLanguage(s.language)
    setTitleLocked(true)
    setSuggestions([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    if (isEdit) {
      await onUpdate(existing!.singerSongId, key, notes)
    } else {
      await onAdd(title.trim(), language, key, notes)
    }
    setSaving(false)
    onClose()
  }

  const keyOptions = MUSICAL_KEYS.map((k) => ({ value: k, label: k }))
  const langOptions = LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_LABELS[l] }))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isEdit ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-400">Canción</p>
          <p className="text-slate-100 font-medium">{existing!.songTitle}</p>
          <span className="text-xs text-slate-500">{LANGUAGE_LABELS[existing!.language]}</span>
        </div>
      ) : (
        <div className="relative">
          <Input
            label="Título"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleLocked(false) }}
            placeholder="Ej: Amazing Grace"
            autoFocus
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  className="px-3 py-2 hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                  onClick={() => pickSuggestion(s)}
                >
                  <span className="text-slate-100 text-sm">{s.title}</span>
                  <span className="text-xs text-slate-500">{LANGUAGE_LABELS[s.language]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!isEdit && (
        <Select
          label="Idioma"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          options={langOptions}
          disabled={titleLocked}
        />
      )}

      <Select
        label="Tono (Key)"
        value={key}
        onChange={(e) => setKey(e.target.value as MusicalKey)}
        options={keyOptions}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Capo 2, le cuesta el puente…"
          rows={2}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving || !title.trim()}>
          {saving ? 'Guardando…' : isEdit ? 'Actualizar' : 'Añadir'}
        </Button>
      </div>
    </form>
  )
}
