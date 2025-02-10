import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePlaylistModalProps {
  onClose: () => void;
  onCreatePlaylist: (name: string) => void;
}

export function CreatePlaylistModal({ onClose, onCreatePlaylist }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreatePlaylist(playlistName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white placeholder-gray-400 mb-4"
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!playlistName.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}