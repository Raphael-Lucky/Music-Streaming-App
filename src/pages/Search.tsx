import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Song, Playlist } from '../types';
import { songs } from '../data/mockData';
import { SongList } from '../components/SongList';

interface SearchProps {
  onSongSelect: (song: Song, playlist?: Playlist) => void;
  currentSong?: Song | null;
  playlists: Playlist[];
  onAddToPlaylist: (song: Song, playlistId: string) => void;
  addToFavorites: (song: Song) => void;
  removeFromFavorites?: (song: Song) => void;
  createPlaylist: (name: string) => Playlist;
}

export const Search: React.FC<SearchProps> = ({ 
  onSongSelect, 
  currentSong, 
  playlists,
  onAddToPlaylist,
  addToFavorites,
  removeFromFavorites,
  createPlaylist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) || 
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSongSelect = (song: Song) => {
    onSongSelect(song);
    setSelectedSong(song);
    setIsPlaylistModalOpen(true);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (selectedSong) {
      onAddToPlaylist(selectedSong, playlistId);
      setIsPlaylistModalOpen(false);
      setSelectedSong(null);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>
      
      {searchQuery && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <SongList
            songs={searchResults}
            onSongSelect={handleSongSelect}
            currentSong={currentSong}
          />
        </div>
      )}
      
      {/* Playlist Selection Modal */}
      {isPlaylistModalOpen && selectedSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add to Playlist</h2>
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsPlaylistModalOpen(false)}
              className="mt-4 w-full p-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};