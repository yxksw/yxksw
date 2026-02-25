import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

// 音乐胶囊配置
const MUSIC_CONFIG = {
  enable: true,
  id: '13681647281', // 网易云歌单ID
  server: 'netease',
  type: 'playlist',
  meting_api: 'https://meting.050815.xyz/api?server=:server&type=:type&id=:id&auth=:auth&r=:r',
  volume: 0.8,
};

interface Song {
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc?: string;
}

export default function MusicCapsule() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(MUSIC_CONFIG.volume);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 获取歌单
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const apiUrl = MUSIC_CONFIG.meting_api
          .replace(':server', MUSIC_CONFIG.server)
          .replace(':type', MUSIC_CONFIG.type)
          .replace(':id', MUSIC_CONFIG.id)
          .replace(':auth', '')
          .replace(':r', Date.now().toString());
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const songs = data.map((item: any) => ({
            name: item.name || item.title || '未知歌曲',
            artist: item.artist || item.author || '未知艺术家',
            url: item.url || '',
            cover: item.pic || item.cover || '',
            lrc: item.lrc || '',
          }));
          setPlaylist(songs);
          setCurrentSong(songs[0]);
        }
      } catch (error) {
        console.error('获取歌单失败:', error);
      }
    };

    if (MUSIC_CONFIG.enable) {
      fetchPlaylist();
    }
  }, []);

  // 播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 上一首
  const prevSong = () => {
    if (playlist.length === 0) return;
    const newIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentSong(playlist[newIndex]);
    setIsPlaying(true);
  };

  // 下一首
  const nextSong = () => {
    if (playlist.length === 0) return;
    const newIndex = currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setCurrentSong(playlist[newIndex]);
    setIsPlaying(true);
  };

  // 更新进度
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // 跳转进度
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // 格式化时间
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!MUSIC_CONFIG.enable || playlist.length === 0) {
    return null;
  }

  return (
    <>
      {/* 音频元素 */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
        onLoadedMetadata={handleTimeUpdate}
        autoPlay={isPlaying}
      />

      {/* 音乐胶囊 */}
      <div
        className={`fixed bottom-28 sm:bottom-24 right-2 sm:right-5 z-[1001] transition-all duration-300 ${
          isExpanded ? '' : 'max-w-[calc(100vw-1rem)]'
        }`}
      >
        {/* 收起状态 - 胶囊按钮 */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="music-capsule-btn flex items-center gap-2 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg transition-all hover:scale-105"
          >
            <div className="music-cover relative w-8 h-8 rounded-full overflow-hidden">
              {currentSong?.cover ? (
                <img
                  src={currentSong.cover}
                  alt={currentSong.name}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
                />
              ) : (
                <Music className="w-5 h-5 m-1.5" />
              )}
            </div>
            <div className="text-left">
              <p className="music-name text-sm font-medium truncate max-w-[120px]">
                {currentSong?.name || '未播放'}
              </p>
              <p className="music-artist text-xs truncate max-w-[120px]">
                {currentSong?.artist || '未知艺术家'}
              </p>
            </div>
            {isPlaying && (
              <div className="flex gap-0.5">
                <span className="w-1 h-3 rounded-full animate-music-bar-1" />
                <span className="w-1 h-4 rounded-full animate-music-bar-2" />
                <span className="w-1 h-2 rounded-full animate-music-bar-3" />
              </div>
            )}
          </button>
        )}

        {/* 展开状态 - 播放器面板 */}
        {isExpanded && (
          <div className="music-player-panel backdrop-blur-md border rounded-2xl shadow-xl overflow-hidden w-80 max-w-[calc(100vw-1rem)] max-h-[calc(100vh-8rem)] flex flex-col">
            {/* 头部 */}
            <div className="music-header flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
                <span className="font-medium">音乐胶囊</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="music-close-btn transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 歌曲信息 */}
            <div className="p-4 text-center shrink-0">
              <div className="music-cover-large w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-xl overflow-hidden mb-3 shadow-md">
                {currentSong?.cover ? (
                  <img
                    src={currentSong.cover}
                    alt={currentSong.name}
                    className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
                  />
                ) : (
                  <Music className="w-12 h-12 sm:w-16 sm:h-16 m-6 sm:m-8" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <h3 className="music-song-name font-bold truncate text-base sm:text-lg">{currentSong?.name}</h3>
              <p className="music-song-artist text-sm truncate">{currentSong?.artist}</p>
            </div>

            {/* 可滚动内容区域 */}
            <div className="flex-1 overflow-y-auto min-h-0">

            {/* 进度条 */}
            <div className="px-4 pb-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="music-progress w-full h-1 rounded-full appearance-none cursor-pointer"
              />
              <div className="music-time flex justify-between text-xs mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-4 p-4">
              <button
                onClick={prevSong}
                className="music-control-btn p-2 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="music-play-btn p-3 rounded-full text-white transition-colors shadow-lg hover:shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={nextSong}
                className="music-control-btn p-2 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* 音量控制 */}
            <div className="flex items-center gap-2 px-4 pb-4">
              <Volume2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                  }
                }}
                className="music-volume flex-1 h-1 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* 播放列表 */}
            <div className="music-playlist overflow-y-auto border-t" style={{ maxHeight: '40vh' }}>
              {playlist.map((song, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setCurrentSong(song);
                    setIsPlaying(true);
                  }}
                  className={`music-playlist-item w-full flex items-center gap-3 p-3 transition-colors text-left ${
                    currentIndex === index ? 'active' : ''
                  }`}
                >
                  <span className="music-playlist-index text-xs w-5">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="music-playlist-name text-sm truncate">
                      {song.name}
                    </p>
                    <p className="music-playlist-artist text-xs truncate">{song.artist}</p>
                  </div>
                  {currentIndex === index && isPlaying && (
                    <div className="flex gap-0.5">
                      <span className="w-0.5 h-3 rounded-full animate-music-bar-1" />
                      <span className="w-0.5 h-4 rounded-full animate-music-bar-2" />
                      <span className="w-0.5 h-2 rounded-full animate-music-bar-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes music-bar-1 {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        @keyframes music-bar-2 {
          0%, 100% { height: 16px; }
          50% { height: 8px; }
        }
        @keyframes music-bar-3 {
          0%, 100% { height: 12px; }
          50% { height: 6px; }
        }
        .animate-music-bar-1 {
          animation: music-bar-1 0.8s ease-in-out infinite;
          background: var(--accent-color);
        }
        .animate-music-bar-2 {
          animation: music-bar-2 0.6s ease-in-out infinite;
          background: var(--accent-color);
        }
        .animate-music-bar-3 {
          animation: music-bar-3 0.7s ease-in-out infinite;
          background: var(--accent-color);
        }

        /* 胶囊按钮 */
        .music-capsule-btn {
          background: var(--bg-secondary);
          border-color: var(--border-color);
        }
        .music-capsule-btn:hover {
          box-shadow: 0 8px 25px var(--shadow-color);
        }
        .music-cover {
          background: var(--border-color);
        }
        .music-cover svg {
          color: var(--text-muted);
        }
        .music-name {
          color: var(--text-primary);
        }
        .music-artist {
          color: var(--text-muted);
        }

        /* 播放器面板 */
        .music-player-panel {
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .music-header {
          border-color: var(--border-color);
          color: var(--text-primary);
        }
        .music-close-btn {
          color: var(--text-muted);
        }
        .music-close-btn:hover {
          color: var(--text-primary);
        }
        .music-cover-large {
          background: var(--border-color);
        }
        .music-song-name {
          color: var(--text-primary);
        }
        .music-song-artist {
          color: var(--text-muted);
        }

        /* 进度条 */
        .music-progress {
          background: var(--border-color);
        }
        .music-progress::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--accent-color);
          border-radius: 50%;
        }
        .music-time {
          color: var(--text-muted);
        }

        /* 控制按钮 */
        .music-control-btn {
          color: var(--text-secondary);
        }
        .music-control-btn:hover {
          background: var(--border-color);
        }
        .music-play-btn {
          background: var(--accent-color);
        }
        .music-play-btn:hover {
          opacity: 0.9;
        }

        /* 音量 */
        .music-volume {
          background: var(--border-color);
        }
        .music-volume::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          background: var(--text-muted);
          border-radius: 50%;
        }

        /* 播放列表 */
        .music-playlist {
          border-color: var(--border-color);
        }
        .music-playlist-item {
          color: var(--text-primary);
        }
        .music-playlist-item:hover {
          background: var(--border-color);
        }
        .music-playlist-item.active {
          background: rgba(102, 126, 234, 0.1);
        }
        .music-playlist-index {
          color: var(--text-muted);
        }
        .music-playlist-name {
          color: var(--text-primary);
        }
        .music-playlist-item.active .music-playlist-name {
          color: var(--accent-color);
          font-weight: 500;
        }
        .music-playlist-artist {
          color: var(--text-muted);
        }
      `}</style>
    </>
  );
}
