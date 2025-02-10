import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Volume1, 
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle
} from 'lucide-react';
import { Song, Playlist } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  playlists: Playlist[];
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  updatePlaylists: (newPlaylists: Playlist[]) => void;
  repeatMode: 'off' | 'all' | 'one';
  onRepeatClick: () => void;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong, 
  playlists, 
  isPlaying, 
  onPlayPause,
  onNext,
  onPrevious,
  updatePlaylists,
  repeatMode,
  onRepeatClick
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);

  // Format time to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Volume Icon Logic
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  // Handle Volume Change and Playlist Update
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Update volume settings in playlists
    const volumePlaylist = playlists.find(p => p.id === 'volume-settings');
    if (volumePlaylist) {
      const updatedPlaylists = playlists.map(p => 
        p.id === 'volume-settings' 
          ? { ...p, name: `Volume: ${Math.round(newVolume * 100)}%` }
          : p
      );
      updatePlaylists(updatedPlaylists);
    }
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      
      if (newMuteState) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume;
      }
    }
  };

  // Handle Progress Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Update time and duration
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const updateCurrentTime = () => {
        setCurrentTime(audioElement.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };

      audioElement.addEventListener('timeupdate', updateCurrentTime);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audioElement.removeEventListener('timeupdate', updateCurrentTime);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentSong]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full mb-2">
        <input 
          type="range" 
          min="0" 
          max={duration || 0} 
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 w-1/3">
          {currentSong && (
            <>
              <img 
                src={currentSong.coverUrl} 
                alt={`${currentSong.title} cover`} 
                className="w-12 h-12 rounded"
              />
              <div>
                <p className="font-bold text-white">{currentSong.title}</p>
                <p className="text-sm text-gray-400">{currentSong.artist}</p>
              </div>
            </>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`text-white ${isShuffle ? 'text-green-500' : 'text-gray-400'}`}
            title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle size={20} />
          </button>
          <button onClick={onPrevious} className="text-white hover:text-gray-300">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={onPlayPause} 
            className="bg-white text-black rounded-full p-2 hover:bg-gray-200"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={onNext} className="text-white hover:text-gray-300">
            <SkipForward size={24} />
          </button>
          <button onClick={onRepeatClick} className={`text-white ${repeatMode === 'off' ? 'text-gray-400' : 'text-green-500'}`}>
            {repeatMode === 'off' ? <Repeat size={20} /> : repeatMode === 'all' ? <Repeat1 size={20} /> : <Repeat1 size={20} />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-1/3 justify-end">
          <button onClick={toggleMute} className="text-white">
            {getVolumeIcon()}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Hidden Audio Element */}
      {currentSong && (
        <audio 
          ref={audioRef} 
          src={currentSong.audioUrl} 
          autoPlay={isPlaying}
        />
      )}
    </div>
  );
};