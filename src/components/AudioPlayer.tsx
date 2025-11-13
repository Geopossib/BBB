
'use client';

import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  src: string;
  duration: string; 
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, duration: initialDuration }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set the source if it has changed
    if (audio.src !== src) {
        audio.src = src;
        audio.load();
    }

    const setAudioData = () => {
      const audioDuration = audio.duration;
      if (audioDuration && isFinite(audioDuration)) {
        setDuration(audioDuration);
      } else {
        // Fallback for when metadata is slow
        const [minutes, seconds] = initialDuration.split(':').map(Number);
        setDuration((minutes * 60) + (seconds || 0));
      }
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Attach event listeners
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);

    // Initial check in case loadedmetadata already fired
    if (audio.readyState > 0) {
      setAudioData();
    }

    // Cleanup function
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [src, initialDuration]); // Re-run effect if src or initialDuration changes

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
    }
  }, [isPlaying]);

  const handleTimeSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
            audioRef.current.muted = false;
        } else if (newVolume === 0 && !isMuted) {
             setIsMuted(true);
             audioRef.current.muted = true;
        }
    }
  };

  const toggleMute = () => {
      if(audioRef.current) {
          const currentlyMuted = !audioRef.current.muted;
          audioRef.current.muted = currentlyMuted;
          setIsMuted(currentlyMuted);
          // If unmuting, restore volume to a listenable level if it was 0
          if (!currentlyMuted && audioRef.current.volume === 0) {
              const newVolume = 0.5;
              setVolume(newVolume);
              audioRef.current.volume = newVolume;
          }
      }
  }

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
      <audio ref={audioRef} preload="metadata" />

      <div className="flex items-center gap-4">
        <Button onClick={handlePlayPause} size="icon" className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={!src}>
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
        </Button>
        <div className="flex flex-col flex-grow gap-1">
            <Slider
                value={[currentTime]}
                max={duration || 1}
                step={0.1}
                onValueChange={handleTimeSliderChange}
                disabled={!src || duration === 0}
                />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
      </div>
      
       <div className="flex items-center justify-between gap-4 mt-2">
         <div className="flex items-center gap-2 w-1/3">
            <Button onClick={toggleMute} size="icon" variant="ghost" disabled={!src}>
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
                disabled={!src}
            />
         </div>
        
        <div className="flex justify-end w-1/3">
            <Button asChild variant="ghost" size="icon" disabled={!src}>
                <a href={src} download>
                    <Download className="h-5 w-5 text-muted-foreground" />
                </a>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
