
'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  duration: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, duration }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) { // Ensure duration is available
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    // Reset state when src changes
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);


    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
        const newTime = (value[0] / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-secondary/50">
      <audio ref={audioRef} src={src} preload="metadata"></audio>
      <Button onClick={togglePlayPause} size="icon" variant="ghost">
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      <div className="flex-grow flex items-center gap-2">
        <span className="text-sm font-mono w-12 text-muted-foreground">{formatTime(currentTime)}</span>
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
        />
        <span className="text-sm font-mono w-12 text-muted-foreground">{duration}</span>
      </div>
      <Button onClick={toggleMute} size="icon" variant="ghost">
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
      <Button asChild variant="outline" size="icon">
        <a href={src} download>
          <Download className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
};

export default AudioPlayer;
