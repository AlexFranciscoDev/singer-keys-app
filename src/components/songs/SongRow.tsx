import { useState } from 'react'
import type { SingerSongView, Song } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SongForm } from './SongForm'

interface SongRowProps {
  view: SingerSongView
  songs: Song[]
  onUpdate: (id: string, key: import('@/types').MusicalKey, notes?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function SongRow({ view, songs, onUpdate, onDelete }: SongRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)

  return (
    <>
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-4 py-3 group">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-100 truncate">{view.songTitle}</span>
              <Badge language={view.language} />
            </div>
            {view.notes && (
              <button
                onClick={() => setNotesExpanded(!notesExpanded)}
                className="mt-1 text-xs text-slate-500 hover:text-slate-300 transition-colors text-left cursor-pointer"
              >
                {notesExpanded ? view.notes : `📝 ${view.notes.slice(0, 50)}${view.notes.length > 50 ? '…' : ''}`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-blue-400 min-w-[2.5rem] text-right">
              {view.key}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} title="Editar">
                ✏️
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)} title="Eliminar">
                🗑️
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Editar canción">
        <SongForm
          songs={songs}
          existing={view}
          onAdd={async () => {}}
          onUpdate={onUpdate}
          onClose={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete(view.singerSongId)}
        title="Eliminar canción"
        message={`¿Eliminar "${view.songTitle}" de este cantante?`}
      />
    </>
  )
}
