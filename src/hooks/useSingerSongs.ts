import { useEffect, useState } from 'react'
import {
  onSnapshot, query, where,
  addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { singerSongsRef } from '@/firebase/collections'
import { useAuth } from '@/context/AuthContext'
import type { Singer, Song, SingerSong, SingerSongView, MusicalKey } from '@/types'

export function useSingerSongs(singers: Singer[], songs: Song[]) {
  const { user } = useAuth()
  const [singerSongs, setSingerSongs] = useState<SingerSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setSingerSongs([]); setLoading(false); return }

    const q = query(singerSongsRef(), where('uid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setSingerSongs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SingerSong, 'id'>) })))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [user])

  const singerMap = new Map(singers.map((s) => [s.id, s.name]))
  const songMap = new Map(songs.map((s) => [s.id, s]))

  function toView(ss: SingerSong): SingerSongView | null {
    const song = songMap.get(ss.songId)
    const singerName = singerMap.get(ss.singerId)
    if (!song || !singerName) return null
    return {
      singerSongId: ss.id,
      singerId: ss.singerId,
      singerName,
      songId: ss.songId,
      songTitle: song.title,
      language: song.language,
      key: ss.key,
      notes: ss.notes,
    }
  }

  function getForSinger(singerId: string): SingerSongView[] {
    return singerSongs
      .filter((ss) => ss.singerId === singerId)
      .map(toView)
      .filter((v): v is SingerSongView => v !== null)
      .sort((a, b) => a.songTitle.localeCompare(b.songTitle))
  }

  function searchByTitle(searchTerm: string): Map<string, SingerSongView[]> {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return new Map()

    const results = singerSongs
      .map(toView)
      .filter((v): v is SingerSongView => v !== null)
      .filter((v) => v.songTitle.toLowerCase().includes(q))

    const grouped = new Map<string, SingerSongView[]>()
    for (const v of results) {
      const existing = grouped.get(v.songId) ?? []
      existing.push(v)
      grouped.set(v.songId, existing)
    }
    return grouped
  }

  function getCommonKeys(singerId: string): MusicalKey[] {
    const keys = singerSongs.filter((ss) => ss.singerId === singerId).map((ss) => ss.key)
    if (keys.length < 2) return []
    const freq = new Map<MusicalKey, number>()
    for (const k of keys) freq.set(k, (freq.get(k) ?? 0) + 1)
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k)
  }

  async function addSingerSong(singerId: string, songId: string, key: MusicalKey, notes?: string) {
    if (!user) return
    await addDoc(singerSongsRef(), { singerId, songId, key, notes: notes ?? '', uid: user.uid })
  }

  async function updateSingerSong(id: string, key: MusicalKey, notes?: string) {
    await updateDoc(doc(db, 'singerSongs', id), { key, notes: notes ?? '' })
  }

  async function removeSingerSong(id: string) {
    await deleteDoc(doc(db, 'singerSongs', id))
  }

  return {
    singerSongs,
    loading,
    getForSinger,
    searchByTitle,
    getCommonKeys,
    addSingerSong,
    updateSingerSong,
    removeSingerSong,
  }
}
