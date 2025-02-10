import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Library from './pages/Library';
import Home from './pages/Home';
import { Search } from './pages/Search';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { songs } from './data/mockData';
import { Song, Playlist } from './types';

function App() {
  const [currentSong, setCurrentSong] = React.useState<Song | null>(null);
  const [playlists, setPlaylists] = React.useState<Playlist[]>(() => {
    const savedPlaylists = localStorage.getItem('musicAppPlaylists');
    return savedPlaylists 
      ? JSON.parse(savedPlaylists) 
      : [
          {
            id: 'all-songs',
            name: 'All Songs',
            songs: songs
          },
          {
            id: 'favorites',
            name: 'Favorites',
            songs: []
          }
        ];
  });
  const [currentPlaylist, setCurrentPlaylist] = React.useState<Playlist | undefined>(
    playlists.find(p => p.id === 'all-songs')
  );
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<'off' | 'all' | 'one'>('off');
  const [modalContent, setModalContent] = React.useState<React.ReactNode>(null);

  const handleNext = () => {
    if (!currentSong || !currentPlaylist) return;

    // Find current song index in the playlist
    const currentIndex = currentPlaylist.songs.findIndex(
      song => song.id === currentSong.id
    );

    // Calculate next song index
    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentPlaylist.songs.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else if (repeatMode === 'off') {
        // Stop playing if no repeat
        return;
      }
    }

    // Get next song
    const nextSong = currentPlaylist.songs[nextIndex];

    // Immediately change and play the song
    if (nextSong) {
      setCurrentSong(nextSong);
      
      // Ensure audio plays immediately
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.src = nextSong.audioUrl;
        
        // Only play if currently playing
        if (isPlaying) {
          audioElement.play();
        }
      }
    }
  };

  const handlePrevious = () => {
    if (!currentSong || !currentPlaylist) return;

    // Find current song index in the playlist
    const currentIndex = currentPlaylist.songs.findIndex(
      song => song.id === currentSong.id
    );

    // Calculate previous song index
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = currentPlaylist.songs.length - 1;
      } else if (repeatMode === 'off') {
        // Stop if no repeat
        return;
      }
    }

    // Get previous song
    const prevSong = currentPlaylist.songs[prevIndex];

    // Immediately change and play the song
    if (prevSong) {
      setCurrentSong(prevSong);
      
      // Ensure audio plays immediately
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.src = prevSong.audioUrl;
        
        // Only play if currently playing
        if (isPlaying) {
          audioElement.play();
        }
      }
    }
  };

  const handleRepeatClick = () => {
    const repeatModes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = repeatModes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatModes.length;
    setRepeatMode(repeatModes[nextIndex]);
  };

  const updatePlaylists = (newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    localStorage.setItem('musicAppPlaylists', JSON.stringify(newPlaylists));
  };

  const handleSongSelect = (song: Song, playlist?: Playlist | null) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist || { 
      id: 'all-songs', 
      name: 'All Songs', 
      songs: songs 
    });
    setIsPlaying(true);
  };

  const handleSearchClick = () => {
    // Placeholder for future implementation
  };

  const handleCreatePlaylistClick = () => {
    const newPlaylist = createPlaylist('New Playlist');
    setCurrentPlaylist(newPlaylist);
  };

  const handlePlayPause = () => {
    const audioElement = document.querySelector('audio');
    
    if (audioElement) {
      if (isPlaying) {
        // Immediately pause
        audioElement.pause();
      } else {
        // Immediately play
        audioElement.play();
      }
    }
    
    // Toggle playing state
    setIsPlaying(!isPlaying);
  };

  const createPlaylist = (name: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name,
      songs: []
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    updatePlaylists(updatedPlaylists);

    return newPlaylist;
  };

  const deletePlaylist = (playlistId: string) => {
    const updatedPlaylists = playlists.filter(
      playlist => playlist.id !== playlistId
    );

    updatePlaylists(updatedPlaylists);
  };

  const addSongToPlaylist = (song: Song, playlistId: string) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if song is already in the playlist
        const isSongInPlaylist = playlist.songs.some(s => s.id === song.id);
        
        return {
          ...playlist,
          songs: isSongInPlaylist 
            ? playlist.songs 
            : [...playlist.songs, song]
        };
      }
      return playlist;
    });

    updatePlaylists(updatedPlaylists);
  };

  const addToFavorites = (song: Song) => {
    // Find the 'favorites' playlist or create it if it doesn't exist
    let updatedPlaylists = [...playlists];
    let favoritesPlaylist = updatedPlaylists.find(p => p.id === 'favorites');

    if (!favoritesPlaylist) {
      favoritesPlaylist = { 
        id: 'favorites', 
        name: 'Favorites', 
        songs: [] 
      };
      updatedPlaylists.push(favoritesPlaylist);
    }

    // Check if song is already in favorites
    const isAlreadyFavorite = favoritesPlaylist.songs.some(s => s.id === song.id);
    
    if (!isAlreadyFavorite) {
      // Add song to favorites
      favoritesPlaylist.songs.push(song);
      updatePlaylists(updatedPlaylists);

      // Show success modal
      setModalContent(
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-green-500"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">{song.title}</h2>
          <h3 className="text-lg mb-4 text-gray-600">{song.artist}</h3>
          <h4 className="text-xl font-bold mb-4 text-black">Add to Favourite Successfully</h4>
          <button 
            onClick={() => setModalContent(null)}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Close
          </button>
        </div>
      );
    } else {
      // If song is already in favorites, show an error modal
      setModalContent(
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">{song.title}</h2>
          <h3 className="text-lg mb-4 text-gray-600">{song.artist}</h3>
          <h4 className="text-xl font-bold mb-4 text-red-600">Already in Favourites</h4>
          <button 
            onClick={() => setModalContent(null)}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      );
    }
  };

  const removeFromFavorites = (song: Song) => {
    // Find the favorites playlist
    let updatedPlaylists = [...playlists];
    let favoritesPlaylist = updatedPlaylists.find(p => p.id === 'favorites');

    if (favoritesPlaylist) {
      // Remove the song from favorites
      favoritesPlaylist.songs = favoritesPlaylist.songs.filter(s => s.id !== song.id);
      
      // Update playlists
      updatePlaylists(updatedPlaylists);

      // Show removal confirmation
      setModalContent(
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-red-500"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black">{song.title}</h2>
          <h3 className="text-lg mb-4 text-gray-600">{song.artist}</h3>
          <h4 className="text-xl font-bold mb-4 text-red-600">Removed from Favourites</h4>
          <button 
            onClick={() => setModalContent(null)}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      );
    }
  };

  const showAllSongsModal = () => {
    // Get all songs from the home page (first playlist)
    const allSongs = playlists[0]?.songs || [];
    
    // Get current favorites to prevent re-adding
    const currentFavorites = playlists.find(p => p.id === 'favorites')?.songs || [];
    const currentFavoriteIds = new Set(currentFavorites.map(s => s.id));

    setModalContent(
      <div className="bg-white p-6 rounded-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Songs to Favorites</h2>
        <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
          {allSongs.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center justify-between p-2 border-b"
            >
              <div className="flex items-center">
                <img 
                  src={song.coverUrl || ''} 
                  alt={song.title} 
                  className="w-12 h-12 mr-4 rounded"
                />
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Add song to favorites if not already added
                  if (!currentFavoriteIds.has(song.id)) {
                    addToFavorites(song);
                  }
                }}
                disabled={currentFavoriteIds.has(song.id)}
                className={`
                  px-3 py-1 rounded 
                  ${currentFavoriteIds.has(song.id) 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600'}
                `}
              >
                {currentFavoriteIds.has(song.id) ? 'Added' : 'Add'}
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setModalContent(null)}
          className="mt-4 w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  };

  const routes = [
    {
      path: '/',
      element: (
        <Home 
          playlists={playlists}
          updatePlaylists={updatePlaylists}
          currentPlaylist={playlists.find(p => p.id === 'all-songs')}
          onSongSelect={(song, playlist) => handleSongSelect(song, playlist ?? undefined)}
          currentSong={currentSong}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
        />
      )
    },
    {
      path: '/search',
      element: (
        <Search 
          playlists={playlists}
          onSongSelect={(song, playlist) => handleSongSelect(song, playlist ?? undefined)}
          currentSong={currentSong}
          onAddToPlaylist={addSongToPlaylist}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          createPlaylist={createPlaylist}
        />
      )
    },
    {
      path: '/library',
      element: (
        <Library 
          playlists={playlists}
          setPlaylists={setPlaylists}
          addSongToPlaylist={addSongToPlaylist}
          createPlaylist={createPlaylist}
          deletePlaylist={deletePlaylist}
          currentSong={currentSong}
          handleSongSelect={(song, playlist) => handleSongSelect(song, playlist ?? undefined)}
          updatePlaylists={updatePlaylists}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
        />
      )
    },
    {
      path: '/favorites',
      element: (
        <Home 
          playlists={[playlists.find(p => p.id === 'favorites')].filter(Boolean) as Playlist[]}
          updatePlaylists={updatePlaylists}
          currentPlaylist={playlists.find(p => p.id === 'favorites') || undefined}
          onSongSelect={(song, playlist) => handleSongSelect(song, playlist ?? undefined)}
          currentSong={currentSong}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
        />
      )
    },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar 
          playlists={playlists} 
          onPlaylistSelect={setCurrentPlaylist}
          onCreatePlaylistClick={handleCreatePlaylistClick}
          onSearchClick={handleSearchClick}
          showAllSongsModal={showAllSongsModal}
        />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            {routes.map((route, index) => (
              <Route 
                key={index} 
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Routes>
        </div>
        <Player 
          currentSong={currentSong} 
          playlists={playlists}
          updatePlaylists={updatePlaylists}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          repeatMode={repeatMode}
          onRepeatClick={handleRepeatClick}
        />
        {modalContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {modalContent}
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;