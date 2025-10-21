
'use client';

import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  duration: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, duration: initialDuration }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'hsl(var(--muted-foreground) / 0.5)',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--primary))',
      height: 80,
      barWidth: 3,
      barGap: 3,
      barRadius: 2,
      url: src,
      barAlign: 'bottom',
    });

    wavesurferRef.current = wavesurfer;

    wavesurfer.on('ready', (duration) => {
      setTotalDuration(duration);
    });

    wavesurfer.on('audioprocess', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.on('finish', () => {
      setIsPlaying(false);
    });
    
    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));


    return () => {
      wavesurfer.destroy();
    };
  }, [src]);

  const handlePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);
  
  const handleSeek = (direction: 'forward' | 'backward') => {
      if (!wavesurferRef.current) return;
      const amount = 5; // seek 5 seconds
      const currentTime = wavesurferRef.current.getCurrentTime();
      const duration = wavesurferRef.current.getDuration();
      const newTime = direction === 'forward' ? currentTime + amount : currentTime - amount;
      wavesurferRef.current.seekTo(newTime / duration);
  }


  const handleMute = () => {
    if(wavesurferRef.current) {
        wavesurferRef.current.setMuted(!isMuted);
        setIsMuted(!isMuted);
    }
  }


  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div ref={waveformRef} className="w-full cursor-pointer" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-mono text-muted-foreground w-14 text-center">
            {formatTime(currentTime)}
        </span>
        <div className="flex items-center gap-2">
            <Button onClick={() => handleSeek('backward')} size="icon" variant="ghost" className="hidden sm:inline-flex">
              <Rewind className="h-5 w-5" />
            </Button>
            <Button onClick={handlePlayPause} size="icon" className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </Button>
            <Button onClick={() => handleSeek('forward')} size="icon" variant="ghost" className="hidden sm:inline-flex">
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        <span className="text-sm font-mono text-muted-foreground w-14 text-center">
            {formatTime(totalDuration)}
        </span>
      </div>
       <div className="flex items-center justify-center gap-4 mt-2">
         <Button onClick={handleMute} size="icon" variant="ghost">
          {isMuted ? <VolumeX className="h-5 w-5 text-muted-foreground" /> : <Volume2 className="h-5 w-5 text-muted-foreground" />}
        </Button>
        <Button asChild variant="ghost" size="icon">
          <a href={src} download>
            <Download className="h-5 w-5 text-muted-foreground" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
