import { useState } from 'react'
import { useSingers } from '@/hooks/useSingers'
import { useSongs } from '@/hooks/useSongs'
import { useSingerSongs } from '@/hooks/useSingerSongs'
import { SearchResults } from '@/components/search/SearchResults'
import { Input } from '@/components/ui/Input'

export function SearchPage() {
  const { singers } = useSingers()
  const { songs } = useSongs()
  const { searchByTitle } = useSingerSongs(singers, songs)
  const [query, setQuery] = useState('')

  const results = searchByTitle(query)

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold text-slate-100">Buscar canciones</h1>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre de la canción…"
        autoFocus
      />
      {query.trim() === '' ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Escribe el nombre de una canción para ver los tonos por cantante.
        </div>
      ) : (
        <SearchResults groups={results} query={query} />
      )}
    </div>
  )
}
