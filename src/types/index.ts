export type Language = 'English' | 'Spanish' | 'Tagalog'

export type MusicalKey =
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E'
  | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'
  | 'Cm' | 'C#m' | 'Dbm' | 'Dm' | 'D#m' | 'Ebm' | 'Em'
  | 'Fm' | 'F#m' | 'Gbm' | 'Gm' | 'G#m' | 'Abm' | 'Am' | 'A#m' | 'Bbm' | 'Bm'

export interface Singer {
  id: string
  name: string
  uid: string
  createdAt: Date
}

export interface Song {
  id: string
  title: string
  language: Language
  uid: string
}

export interface SingerSong {
  id: string
  singerId: string
  songId: string
  key: MusicalKey
  notes?: string
  uid: string
}

export interface SingerSongView {
  singerSongId: string
  singerId: string
  singerName: string
  songId: string
  songTitle: string
  language: Language
  key: MusicalKey
  notes?: string
}
