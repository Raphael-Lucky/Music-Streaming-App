import React, { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { Song, Playlist } from '../types';
import { SongList } from '../components/SongList';

interface LibraryProps {
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  addSongToPlaylist: (song: Song, playlistId: string) => void;
  createPlaylist: (name: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  currentSong?: Song | null;
  handleSongSelect: (song: Song, playlist: Playlist | null) => void;
  updatePlaylists: (updatedPlaylists: Playlist[]) => void;
  addToFavorites: (song: Song) => void;
  removeFromFavorites?: (song: Song) => void;
}

const Library: React.FC<LibraryProps> = ({ 
  playlists, 
  setPlaylists, 
  addSongToPlaylist, 
  createPlaylist,
  deletePlaylist,
  currentSong,
  handleSongSelect,
  updatePlaylists,
  addToFavorites,
  removeFromFavorites
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  // Predefined order and display of playlists
  const playlistOrder = [
    'current-playlist',
    'favorites',
    // Other custom playlists will be added dynamically
  ];

  // Sort playlists based on the predefined order
  const sortedPlaylists = [...playlists].sort((a, b) => {
    const indexA = playlistOrder.indexOf(a.id);
    const indexB = playlistOrder.indexOf(b.id);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    return 0;
  });

  // Collect songs from the current playlist
  const getCurrentPlaylistSongs = () => {
    const currentPlaylist = playlists.find(p => p.id === 'current-playlist');
    return currentPlaylist ? currentPlaylist.songs : [];
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    // Special handling for all songs, favorites, and current playlist
    if (playlist.id === 'all-songs' || playlist.id === 'favorites' || playlist.id === 'current-playlist') {
      setActivePlaylist(playlist);
    } else {
      setActivePlaylist(playlist);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreatingPlaylist(false);
      setActivePlaylist(newPlaylist);
      
      // Prepare available songs (excluding songs already in the playlist)
      const allSongs = playlists.find(p => p.id === 'current-playlist')?.songs || [];
      setAvailableSongs(allSongs);
      setShowAddSongModal(true);
    }
  };

  // Rename playlists for display
  const getPlaylistDisplayName = (playlist: Playlist) => {
    switch (playlist.id) {
      case 'current-playlist': return 'Current Songs';
      case 'favorites': return 'Add to Favorites';
      default: return playlist.name;
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    // For special playlists, reset their songs instead of deleting
    if (playlistId === 'current-playlist' || playlistId === 'favorites') {
      setPlaylists(currentPlaylists => 
        currentPlaylists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, songs: [] } 
            : playlist
        )
      );
    } else {
      // For custom playlists, use the existing delete method
      deletePlaylist(playlistId);
    }
    
    setActivePlaylist(null);
    setShowDeleteConfirmation(null);
  };

  const handleAddSongToNewPlaylist = (song: Song) => {
    if (activePlaylist) {
      addSongToPlaylist(song, activePlaylist.id);
      
      // Remove the added song from available songs
      setAvailableSongs(prev => prev.filter(s => s.id !== song.id));
      
      // Close modal if no more songs to add
      if (availableSongs.length <= 1) {
        setShowAddSongModal(false);
      }
    }
  };

  const handleRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(currentPlaylists => 
      currentPlaylists.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) }
          : playlist
      )
    );
  };

  return (
    <div className="flex h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">My Playlists</h2>
        
        {/* Playlist Creation */}
        <div className="mb-4 h-[60px] flex items-center">
          {isCreatingPlaylist ? (
            <div className="flex w-full">
              <input 
                type="text" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="bg-gray-700 text-white p-2 rounded-l flex-grow max-w-[calc(100%-80px)]"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              />
              <button 
                onClick={handleCreatePlaylist}
                className="bg-green-600 text-white px-4 py-2 rounded-r w-[80px]"
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsCreatingPlaylist(true)}
              className="bg-green-600 text-white p-2 rounded w-full h-full"
            >
              + New Playlist
            </button>
          )}
        </div>

        {/* Playlist List */}
        <div className="space-y-2">
          {sortedPlaylists.map(playlist => (
            <div 
              key={playlist.id}
              className={`p-3 rounded group relative ${
                activePlaylist?.id === playlist.id 
                  ? 'bg-green-600 text-white' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <div 
                onClick={() => handlePlaylistSelect(playlist)}
                className="flex justify-between items-center cursor-pointer"
              >
                <span>{getPlaylistDisplayName(playlist)}</span>
                <span className="text-sm text-gray-400">
                  {playlist.songs.length} songs
                </span>
              </div>
              
              {/* Delete button for custom playlists */}
              {playlist.id !== 'current-playlist' && playlist.id !== 'favorites' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirmation(playlist.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 ml-4"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 p-8">
        {activePlaylist && (
          <div>
            {activePlaylist.songs.length === 0 ? (
              <div className="text-center text-gray-400">
                <p>No songs in this playlist</p>
                <button 
                  onClick={() => {
                    const allSongs = playlists.find(p => p.id === 'current-playlist')?.songs || [];
                    setAvailableSongs(allSongs);
                    setShowAddSongModal(true);
                  }}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Songs
                </button>
              </div>
            ) : (
              <SongList 
                songs={activePlaylist.songs} 
                currentSong={currentSong}
                playlists={playlists}
                handleSongSelect={(song) => {
                  // Ensure the song is selected from the current playlist
                  const playlist = playlists.find(p => 
                    p.songs.some(s => s.id === song.id)
                  );
                  handleSongSelect(song, playlist);
                }}
                updatePlaylists={updatePlaylists}
                addToFavorites={addToFavorites}
              />
            )}
          </div>
        )}
        
        <div className="mt-4">
          <button 
            onClick={() => {
              const allSongs = playlists.find(p => p.id === 'current-playlist')?.songs || [];
              setAvailableSongs(allSongs);
              setShowAddSongModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Songs
          </button>
        </div>
      </div>

      {/* Add Songs Modal */}
      {showAddSongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Songs to {activePlaylist?.name}</h2>
            <div className="space-y-2">
              {availableSongs.map(song => (
                <div
                  key={song.id}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded hover:bg-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <div className="font-semibold">{song.title}</div>
                      <div className="text-sm text-gray-400">{song.artist}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddSongToNewPlaylist(song)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowAddSongModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Delete Playlist</h2>
            <p className="mb-6">Are you sure you want to delete this playlist?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlaylist(showDeleteConfirmation)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
