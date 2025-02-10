import React, { useState } from 'react';
import { MoreHorizontal, Heart, Play } from 'lucide-react';
import { Song, Playlist } from '../types';

interface SongListProps {
  songs: Song[];
  handleSongSelect: (song: Song) => void;
  addToFavorites?: (song: Song) => void;
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  handleSongSelect,
  addToFavorites
}) => {
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleAddToFavorites = (song: Song) => {
    if (addToFavorites) {
      addToFavorites(song);
      setShowMenu(null);
    }
  };

  return (
    <div>
      {songs.map((song, index) => (
        <div 
          key={song.id} 
          className={`flex items-center justify-between hover:bg-gray-800 p-2 rounded group cursor-pointer`}
          onClick={() => handleSongSelect(song)}
        >
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 w-8">{index + 1}</span>
            <img 
              src={song.coverUrl} 
              alt={song.title} 
              className="w-12 h-12 rounded"
            />
            <div>
              <div className="font-semibold">{song.title}</div>
              <div className="text-gray-400 text-sm">{song.artist}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Play indicator for current song */}
            <span className="text-gray-400">{song.duration}</span>
            
            {/* Three-dot menu */}
            <div 
              className="relative"
              onClick={(e) => e.stopPropagation()} // Prevent song selection when clicking menu
            >
              <button 
                onClick={() => {
                  setShowMenu(showMenu === song.id ? null : song.id);
                  setSelectedSong(song);
                }}
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal size={20} />
              </button>
              
              {showMenu === song.id && (
                <div className="absolute right-0 top-full z-10 bg-gray-700 rounded shadow-lg mt-2 w-48">
                  {addToFavorites && (
                    <button 
                      onClick={() => {
                        handleAddToFavorites(song);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center"
                    >
                      <Heart size={16} className="mr-2" />
                      Add to Favorites
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};