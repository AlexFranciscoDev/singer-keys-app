import type { SingerSongView } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface SearchResultsProps {
  groups: Map<string, SingerSongView[]>
  query: string
}

export function SearchResults({ groups, query }: SearchResultsProps) {
  if (query.trim() && groups.size === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No se encontraron canciones para "{query}"
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {[...groups.entries()].map(([songId, views]) => {
        const first = views[0]
        return (
          <div key={songId} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
              <span className="font-semibold text-slate-100">{first.songTitle}</span>
              <Badge language={first.language} />
            </div>
            <div className="divide-y divide-slate-700/50">
              {views.map((v) => (
                <div key={v.singerSongId} className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 text-sm">{v.singerName}</span>
                    {v.notes && (
                      <p className="text-xs text-slate-500 mt-0.5">📝 {v.notes}</p>
                    )}
                  </div>
                  <span className="text-blue-400 font-bold text-lg">{v.key}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
