import { Playlist, Song } from '../types';

export const songs: Song[] = [
  {
    id: 'midnight-rain',
    title: 'Midnight Rain',
    artist: 'Luna Brooks',
    album: 'Midnight Rain',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
    duration: '3:45',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3'
  },
  {
    id: 'sunflower-dreams',
    title: 'Sunflower Dreams',
    artist: 'The Wanderers',
    album: 'Sunflower Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?w=300&h=300&fit=crop',
    duration: '4:20',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3'
  },
  {
    id: 'urban-lights',
    title: 'Urban Lights',
    artist: 'Metro Pulse',
    album: 'Urban Lights',
    coverUrl: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop',
    duration: '3:55',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b755b42.mp3'
  },
  {
    id: 'electric-pulse',
    title: 'Electric Pulse',
    artist: 'Neon Horizon',
    album: 'Electric Pulse',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    duration: '4:15',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_7a9b5d4e0a.mp3'
  },
  {
    id: 'acoustic-sunrise',
    title: 'Acoustic Sunrise',
    artist: 'Forest Echoes',
    album: 'Acoustic Sunrise',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    duration: '3:30',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/20/audio_8f6b1f4b22.mp3'
  },
  {
    id: 'cosmic-journey',
    title: 'Cosmic Journey',
    artist: 'Stellar Winds',
    album: 'Cosmic Journey',
    coverUrl: 'https://images.unsplash.com/photo-1543722530-a5c3a9ca0ad6?w=300&h=300&fit=crop',
    duration: '5:10',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/07/18/audio_5d4c3b7e9a.mp3'
  },
  {
    id: 'rainy-street',
    title: 'Rainy Street',
    artist: 'Urban Melancholy',
    album: 'Rainy Street',
    coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop',
    duration: '4:05',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/09/10/audio_7b3c8f0a1d.mp3'
  },
  {
    id: 'mountain-breeze',
    title: 'Mountain Breeze',
    artist: 'Alpine Echoes',
    album: 'Mountain Breeze',
    coverUrl: 'https://images.unsplash.com/photo-1476229892979-8e6882e242fe?w=300&h=300&fit=crop',
    duration: '3:50',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/05/audio_9c4b2f3e5a.mp3'
  },
  {
    id: 'digital-love',
    title: 'Digital Love',
    artist: 'Synth Rebels',
    album: 'Digital Love',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
    duration: '4:25',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/12/15/audio_6d1a8f2c3b.mp3'
  },
  {
    id: 'ocean-whispers',
    title: 'Ocean Whispers',
    artist: 'Coastal Harmony',
    album: 'Ocean Whispers',
    coverUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=300&fit=crop',
    duration: '4:40',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2023/01/05/audio_7e3c1a9d2f.mp3'
  },
  {
    id: 'starry-night',
    title: 'Starry Night',
    artist: 'Cosmic Echoes',
    album: 'Starry Night',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
    duration: '4:55',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2023/02/15/audio_8d2c1a9e3f.mp3'
  },
  {
    id: 'trusting-you',
    title: 'Trusting You',
    artist: 'Boy Count',
    album: 'Trust',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
    duration: '3:35',
    audioUrl: 'https://example.com/audio/boy-count-trusting-you.mp3'
  }
];

export const playlists: Playlist[] = [
  {
    id: 'all-songs',
    name: 'All Songs',
    songs: [...songs]
  },
  {
    id: 'favorites',
    name: 'My Favorites',
    songs: []
  }
];