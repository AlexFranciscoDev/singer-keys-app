import { useEffect, useState } from 'react'
import {
  onSnapshot, query, where, getDocs,
  addDoc, updateDoc, doc, writeBatch,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { songsRef, singerSongsRef } from '@/firebase/collections'
import { useAuth } from '@/context/AuthContext'
import type { Language, Song } from '@/types'

export function useSongs() {
  const { user } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setSongs([]); setLoading(false); return }

    const q = query(songsRef(), where('uid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      setSongs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Song, 'id'>) })))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [user])

  async function getOrCreateSong(title: string, language: Language): Promise<string> {
    if (!user) throw new Error('Not authenticated')
    const normalized = title.trim()
    const q = query(songsRef(), where('uid', '==', user.uid), where('title', '==', normalized))
    const snap = await getDocs(q)
    if (!snap.empty) return snap.docs[0].id
    const ref = await addDoc(songsRef(), { title: normalized, language, uid: user.uid })
    return ref.id
  }

  async function updateSong(id: string, data: Partial<Pick<Song, 'title' | 'language'>>) {
    await updateDoc(doc(db, 'songs', id), data)
  }

  async function deleteSong(id: string) {
    const batch = writeBatch(db)
    batch.delete(doc(db, 'songs', id))
    const q = query(singerSongsRef(), where('songId', '==', id))
    const snap = await getDocs(q)
    snap.docs.forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }

  return { songs, loading, getOrCreateSong, updateSong, deleteSong }
}
