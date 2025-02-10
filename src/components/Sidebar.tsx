import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  List as PlaylistIcon, 
  Heart as FavoriteIcon 
} from 'lucide-react';
import { Playlist, Song } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  currentPlaylist?: Playlist | null;
  onPlaylistSelect: (playlist: Playlist) => void;
  onCreatePlaylistClick: () => void;
  onSearchClick: () => void;
  showAllSongsModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  currentPlaylist,
  onPlaylistSelect,
  onCreatePlaylistClick,
  onSearchClick,
  showAllSongsModal
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Find favorites playlist
  const favoritesPlaylist = playlists.find(p => p.id === 'favorites') || 
    { id: 'favorites', name: 'Favorites', songs: [] };

  // Navigation items
  const navItems = [
    { 
      icon: <HomeIcon size={20} />, 
      label: 'Home', 
      path: '/',
      active: location.pathname === '/'
    },
    { 
      icon: <SearchIcon size={20} />, 
      label: 'Search', 
      path: '/search',
      active: location.pathname === '/search',
      onClick: onSearchClick
    },
    { 
      icon: <PlaylistIcon size={20} />, 
      label: 'Playlists', 
      path: '/library',
      active: location.pathname === '/library'
    }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col h-full">
      {/* Navigation Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Navigation</h2>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={item.onClick}
            className={`flex items-center p-2 rounded mb-2 ${
              item.active 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Playlists Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Playlists</h2>
          <button 
            onClick={onCreatePlaylistClick}
            className="text-gray-400 hover:text-white"
            title="Create Playlist"
          >
            +
          </button>
        </div>
        <div className="space-y-2">
          {playlists
            .filter(playlist => playlist.id !== 'favorites')
            .map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onPlaylistSelect(playlist)}
                className={`w-full text-left p-2 rounded ${
                  currentPlaylist?.id === playlist.id 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{playlist.name}</span>
                  <span className="text-sm text-gray-500">
                    {playlist.songs.length} songs
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Favorites Section */}
      <div 
        className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${
          location.pathname === '/favorites' ? 'bg-gray-800' : ''
        }`}
        onClick={() => {
          const favoritesPlaylist = playlists.find(p => p.id === 'favorites');
          if (favoritesPlaylist) {
            onPlaylistSelect(favoritesPlaylist);
            navigate('/favorites');
          }
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 mr-3" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <div className="flex-grow">
          <span>Favorites</span>
        </div>
        <span className="text-gray-400 text-sm">
          {playlists.find(p => p.id === 'favorites')?.songs.length || 0} songs
        </span>
        <button 
          onClick={showAllSongsModal}
          className="text-gray-400 hover:text-white ml-2"
          title="Add Songs"
        >
          +
        </button>
      </div>
    </div>
  );
};