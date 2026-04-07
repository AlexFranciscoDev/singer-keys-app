import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSingers } from '@/hooks/useSingers'
import { useSongs } from '@/hooks/useSongs'
import { useSingerSongs } from '@/hooks/useSingerSongs'
import { SongRow } from '@/components/songs/SongRow'
import { SongForm } from '@/components/songs/SongForm'
import { LanguageFilter } from '@/components/songs/LanguageFilter'
import { SingerKeyProfile } from '@/components/singers/SingerKeyProfile'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { exportToExcel } from '@/utils/export'
import type { Language, MusicalKey } from '@/types'

export function SingerDetailPage() {
  const { singerId } = useParams<{ singerId: string }>()
  const navigate = useNavigate()
  const { singers } = useSingers()
  const { songs, getOrCreateSong } = useSongs()
  const { getForSinger, getCommonKeys, addSingerSong, updateSingerSong, removeSingerSong } =
    useSingerSongs(singers, songs)

  const [langFilter, setLangFilter] = useState<Language | 'all'>('all')
  const [addOpen, setAddOpen] = useState(false)

  const singer = singers.find((s) => s.id === singerId)
  if (!singer) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>Cantante no encontrado.</p>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/singers')}>← Volver</Button>
      </div>
    )
  }

  const allSongs = getForSinger(singer.id)
  const filtered = langFilter === 'all' ? allSongs : allSongs.filter((v) => v.language === langFilter)
  const commonKeys = getCommonKeys(singer.id)

  const counts = {
    all: allSongs.length,
    English: allSongs.filter((v) => v.language === 'English').length,
    Spanish: allSongs.filter((v) => v.language === 'Spanish').length,
    Tagalog: allSongs.filter((v) => v.language === 'Tagalog').length,
  }

  async function handleAdd(title: string, language: Language, key: MusicalKey, notes?: string) {
    const songId = await getOrCreateSong(title, language)
    await addSingerSong(singer!.id, songId, key, notes)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/singers')}>←</Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-100">{singer.name}</h1>
          <SingerKeyProfile keys={commonKeys} />
        </div>
        <div className="flex gap-2">
          {allSongs.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => exportToExcel(allSongs, singer.name)}>
              📥
            </Button>
          )}
          <Button size="sm" onClick={() => setAddOpen(true)}>+ Canción</Button>
        </div>
      </div>

      <LanguageFilter value={langFilter} onChange={setLangFilter} counts={counts} />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {allSongs.length === 0
            ? 'Sin canciones aún. ¡Añade la primera!'
            : 'No hay canciones en este idioma.'}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((v) => (
            <SongRow
              key={v.singerSongId}
              view={v}
              songs={songs}
              onUpdate={updateSingerSong}
              onDelete={removeSingerSong}
            />
          ))}
        </div>
      )}

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Añadir canción">
        <SongForm
          songs={songs}
          onAdd={handleAdd}
          onUpdate={updateSingerSong}
          onClose={() => setAddOpen(false)}
        />
      </Modal>
    </div>
  )
}
