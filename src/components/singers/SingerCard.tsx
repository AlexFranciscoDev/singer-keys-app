import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Singer } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SingerForm } from './SingerForm'

interface SingerCardProps {
  singer: Singer
  songCount: number
  onUpdate: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function SingerCard({ singer, songCount, onUpdate, onDelete }: SingerCardProps) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-blue-500/50 transition-colors cursor-pointer group"
        onClick={() => navigate(`/singers/${singer.id}`)}
      >
        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-400 font-semibold text-sm">
            {singer.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-100 truncate">{singer.name}</p>
          <p className="text-xs text-slate-500">{songCount} canción{songCount !== 1 ? 'es' : ''}</p>
        </div>
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} title="Editar">
            ✏️
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(true)} title="Eliminar">
            🗑️
          </Button>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Editar cantante">
        <SingerForm
          initialName={singer.name}
          onSubmit={(name) => onUpdate(singer.id, name)}
          onClose={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => onDelete(singer.id)}
        title="Eliminar cantante"
        message={`¿Eliminar a "${singer.name}"? Se borrarán también todas sus canciones.`}
      />
    </>
  )
}
