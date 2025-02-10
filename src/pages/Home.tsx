import React from 'react';
import { SongList } from '../components/SongList';
import { Song, Playlist } from '../types';

interface HomeProps {
  playlists: Playlist[];
  updatePlaylists: (updatedPlaylists: Playlist[]) => void;
  currentPlaylist?: Playlist;
  onSongSelect: (song: Song, playlist?: Playlist) => void;
  currentSong?: Song | null;
  addToFavorites?: (song: Song) => void;
  removeFromFavorites?: (song: Song) => void;
}

const Home: React.FC<HomeProps> = ({
  playlists,
  updatePlaylists,
  currentPlaylist,
  onSongSelect,
  currentSong,
  addToFavorites,
  removeFromFavorites
}) => {
  // Determine if we're in the Favorites view
  const isFavoritesView = currentPlaylist?.id === 'favorites';

  return (
    <div className="p-8 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {currentPlaylist?.id === 'all-songs' 
            ? 'All Songs' 
            : currentPlaylist?.name
          }
        </h1>
        <SongList 
          songs={currentPlaylist?.songs || []} 
          currentSong={currentSong}
          playlists={playlists}
          handleSongSelect={(song) => {
            // Ensure the song is selected from the current playlist
            const playlist = playlists.find(p => 
              p.id === 'current-playlist' && 
              p.songs.some(s => s.id === song.id)
            );
            onSongSelect(song, playlist);
          }}
          updatePlaylists={updatePlaylists}
          addToFavorites={addToFavorites}
          removeFromFavorites={isFavoritesView ? removeFromFavorites : undefined}
        />
      </div>
    </div>
  );
};

export default Home;
