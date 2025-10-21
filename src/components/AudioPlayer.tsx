
'use client';

import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  src: string;
  duration: string; // The duration from the database can be used as a fallback.
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  }, [isPlaying]);

  const handleSeek = (direction: 'forward' | 'backward') => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + (direction === 'forward' ? 5 : -5);
      audioRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
    }
  };

  const handleTimeSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
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
          audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
          if (isMuted) { // if it was muted, now unmuted
            audioRef.current.volume = volume > 0 ? volume : 0.5; // restore volume
          } else { // if it was not muted, now muted
            setVolume(audioRef.current.volume); // store current volume
            audioRef.current.volume = 0;
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
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-4">
        <Button onClick={handlePlayPause} size="icon" className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
        </Button>
        <div className="flex flex-col flex-grow gap-1">
            <Slider
                value={[currentTime]}
                max={duration || 1}
                step={1}
                onValueChange={handleTimeSliderChange}
                />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
      </div>
      
       <div className="flex items-center justify-between gap-4 mt-2">
         <div className="flex items-center gap-2 w-1/3">
            <Button onClick={toggleMute} size="icon" variant="ghost">
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
            />
         </div>
        
        <div className="flex items-center gap-2">
            <Button onClick={() => handleSeek('backward')} size="icon" variant="ghost">
              <Rewind className="h-5 w-5" />
            </Button>
            <Button onClick={() => handleSeek('forward')} size="icon" variant="ghost">
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        
        <div className="flex justify-end w-1/3">
            <Button asChild variant="ghost" size="icon">
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
