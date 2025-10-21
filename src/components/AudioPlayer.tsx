
'use client';

import { useState, useRef, useEffect, useCallback, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  src: string;
  duration: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, duration: initialDuration }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the actual <audio> element
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure both the waveform container and the audio element are available
    if (!waveformRef.current || !audioRef.current) return;

    // Destroy previous instance if it exists
    if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'hsl(var(--muted-foreground) / 0.5)',
      progressColor: 'hsl(var(--primary))',
      cursorColor: 'hsl(var(--primary))',
      height: 80,
      barWidth: 3,
      barGap: 3,
      barRadius: 2,
      media: audioRef.current, // Use the <audio> element as the media source
      barAlign: 'bottom',
    });

    wavesurferRef.current = wavesurfer;

    const onReady = (duration: number) => {
      setTotalDuration(duration);
      setIsReady(true);
    };
    
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onFinish = () => setIsPlaying(false);
    const onTimeUpdate = (time: number) => setCurrentTime(time);
    
    wavesurfer.on('ready', onReady);
    wavesurfer.on('play', onPlay);
    wavesurfer.on('pause', onPause);
    wavesurfer.on('finish', onFinish);
    wavesurfer.on('timeupdate', onTimeUpdate);

    return () => {
      // No need to remove specific listeners if we destroy the instance
      wavesurfer.destroy();
    };
  }, [src]); // Re-run this effect ONLY when the src changes

  const handlePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);
  
  const handleSeek = (direction: 'forward' | 'backward') => {
      if (!wavesurferRef.current) return;
      const amount = 5; // seek 5 seconds
      wavesurferRef.current.skip(direction === 'forward' ? amount : -amount);
  }

  const handleMute = () => {
    if(wavesurferRef.current) {
        const newMutedState = !isMuted;
        wavesurferRef.current.setMuted(newMutedState);
        setIsMuted(newMutedState);
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
      <audio ref={audioRef} src={src} crossOrigin="anonymous" preload="metadata" hidden />
      <div ref={waveformRef} className="w-full cursor-pointer" />
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-mono text-muted-foreground w-14 text-center">
            {formatTime(currentTime)}
        </span>
        <div className="flex items-center gap-2">
            <Button onClick={() => handleSeek('backward')} size="icon" variant="ghost" className="hidden sm:inline-flex" disabled={!isReady}>
              <Rewind className="h-5 w-5" />
            </Button>
            <Button onClick={handlePlayPause} size="icon" className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={!isReady}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </Button>
            <Button onClick={() => handleSeek('forward')} size="icon" variant="ghost" className="hidden sm:inline-flex" disabled={!isReady}>
              <FastForward className="h-5 w-5" />
            </Button>
        </div>
        <span className="text-sm font-mono text-muted-foreground w-14 text-center">
            {formatTime(totalDuration)}
        </span>
      </div>
       <div className="flex items-center justify-center gap-4 mt-2">
         <Button onClick={handleMute} size="icon" variant="ghost" disabled={!isReady}>
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
