import { collection } from 'firebase/firestore'
import { db } from './config'

export const singersRef = () => collection(db, 'singers')
export const songsRef = () => collection(db, 'songs')
export const singerSongsRef = () => collection(db, 'singerSongs')
