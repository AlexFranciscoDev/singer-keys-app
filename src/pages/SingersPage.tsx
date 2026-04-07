import { useState } from 'react'
import { useSingers } from '@/hooks/useSingers'
import { useSongs } from '@/hooks/useSongs'
import { useSingerSongs } from '@/hooks/useSingerSongs'
import { SingerCard } from '@/components/singers/SingerCard'
import { SingerForm } from '@/components/singers/SingerForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { exportToExcel } from '@/utils/export'

export function SingersPage() {
  const { singers, loading, addSinger, updateSinger, deleteSinger } = useSingers()
  const { songs } = useSongs()
  const singerSongsHook = useSingerSongs(singers, songs)
  const [addOpen, setAddOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const allViews = singers.flatMap((s) => singerSongsHook.getForSinger(s.id))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">Cantantes</h1>
        <div className="flex gap-2">
          {allViews.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => exportToExcel(allViews, 'cantantes')}>
              📥 Excel
            </Button>
          )}
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Añadir
          </Button>
        </div>
      </div>

      {singers.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">🎤</div>
          <p>No hay cantantes aún.</p>
          <p className="text-sm mt-1">Añade el primero para empezar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {singers.map((s) => (
            <SingerCard
              key={s.id}
              singer={s}
              songCount={singerSongsHook.getForSinger(s.id).length}
              onUpdate={updateSinger}
              onDelete={deleteSinger}
            />
          ))}
        </div>
      )}

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Nuevo cantante">
        <SingerForm onSubmit={addSinger} onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  )
}
