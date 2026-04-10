import { useEffect, useState } from 'react'
import {
  onSnapshot, query, where, getDocs,
  addDoc, updateDoc, doc, writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { singersRef, singerSongsRef } from '@/firebase/collections'
import { useAuth } from '@/context/AuthContext'
import type { Singer } from '@/types'

export function useSingers() {
  const { user } = useAuth()
  const [singers, setSingers] = useState<Singer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setSingers([]); setLoading(false); return }

    const q = query(singersRef(), where('uid', '==', user.uid))
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Singer, 'id'>),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      }))
      // Sort list by createdAt
      list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      setSingers(list)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [user])

  /*
  * addSinger
  * Create new singer with
  */
  async function addSinger(name: string) {
    // If not user logged, don't do anything
    if (!user) return
    await addDoc(singersRef(), { name: name.trim(), uid: user.uid, createdAt: serverTimestamp() })
  }

  /**
   * updateSinger
   * @param id (singer to update)
   * @param name (new name)
   */
  async function updateSinger(id: string, name: string) {
    await updateDoc(doc(db, 'singers', id), { name: name.trim() })
  }

  /**
   * deleteSinger
   * @param id (singer to delete)
   */
  async function deleteSinger(id: string) {
    const batch = writeBatch(db)
    batch.delete(doc(db, 'singers', id))

    const q = query(singerSongsRef(), where('singerId', '==', id))
    const snap = await getDocs(q)
    snap.docs.forEach((d) => batch.delete(d.ref))

    await batch.commit()
  }

  return { singers, loading, addSinger, updateSinger, deleteSinger }
}
