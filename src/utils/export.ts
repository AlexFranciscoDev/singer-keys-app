import * as XLSX from 'xlsx'
import type { SingerSongView } from '@/types'
import { LANGUAGE_LABELS } from '@/constants/keys'

export function exportToExcel(views: SingerSongView[], filename: string) {
  const rows = views.map((v) => ({
    Cantante: v.singerName,
    Canción: v.songTitle,
    Idioma: LANGUAGE_LABELS[v.language],
    Tono: v.key,
    Notas: v.notes ?? '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Canciones')

  const colWidths = [
    { wch: 20 },
    { wch: 30 },
    { wch: 12 },
    { wch: 8 },
    { wch: 30 },
  ]
  ws['!cols'] = colWidths

  XLSX.writeFile(wb, `${filename.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '_')}.xlsx`)
}
