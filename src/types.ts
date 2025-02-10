export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  audioUrl: string; // Added audioUrl field
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}