
'use client';

import { useState, useRef, useEffect, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AudioRecorderProps {
    onBlobChange: (blob: Blob | null, duration: number) => void;
    onReset: () => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ onBlobChange, onReset }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

   useEffect(() => {
    // Cleanup URL object when component unmounts
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setHasPermission(true);
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setBlob(audioBlob);
          setAudioUrl(url);
          audioChunksRef.current = [];
          
          // Use an audio element to get the duration accurately
          const tempAudio = new Audio(url);
          tempAudio.onloadedmetadata = () => {
              setDuration(tempAudio.duration);
              onBlobChange(audioBlob, tempAudio.duration);
          }
        };
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        setHasPermission(false);
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please allow microphone access in your browser to record audio.",
        });
      });

    return () => {
       if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [toast, onBlobChange]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
         setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => setIsPlaying(false);
    const onLoadedMetadata = () => {
      if (audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [audioUrl]);


  const startRecording = () => {
    if (mediaRecorderRef.current && hasPermission) {
      setIsRecording(true);
      setDuration(0); // Reset duration display
      mediaRecorderRef.current.start();
       timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
      }, 1000)
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
       if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
        if(isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  }

  const resetAudio = () => {
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setBlob(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    onReset();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setBlob(file);
        setAudioUrl(url);

        const tempAudio = new Audio(url);
        tempAudio.onloadedmetadata = () => {
            setDuration(tempAudio.duration);
            onBlobChange(file, tempAudio.duration);
        }
      } else {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a valid audio file.'
        });
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  if (hasPermission === false) {
     return (
        <div className='space-y-4 rounded-lg border p-4'>
            <Alert variant="destructive">
            <AlertTitle>Microphone Access Required</AlertTitle>
            <AlertDescription>
                You have denied microphone access. Please enable it in your browser settings to record audio. You can still upload an audio file.
            </AlertDescription>
            </Alert>
             <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor="audio-upload">Upload an Audio File</Label>
                <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileUpload} />
            </div>
        </div>
      );
  }

  if (hasPermission === null) {
      return <div className="flex items-center justify-center p-8"><p>Requesting microphone permission...</p></div>
  }


  return (
    <div className="space-y-4 rounded-lg border p-4">
        {!audioUrl ? (
            <div className='flex flex-col items-center justify-center gap-4'>
                 <div className="flex items-center gap-4">
                    <Button onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? 'destructive' : 'outline'} size="lg" className="w-32" type="button">
                        {isRecording ? <Square className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {isRecording ? 'Stop' : 'Record'}
                    </Button>
                    <div className="text-lg font-mono w-24 text-center">{formatTime(duration)}</div>
                </div>
                 <div className="flex items-center justify-center w-full">
                    <div className="w-full h-px bg-border" />
                    <span className="px-4 text-muted-foreground text-sm">OR</span>
                    <div className="w-full h-px bg-border" />
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                     <Label htmlFor="audio-upload">Upload an Audio File</Label>
                    <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileUpload} />
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Button onClick={togglePlay} size="icon" variant="outline" type="button">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <div className="flex-grow space-y-1">
                        <Progress value={progress} />
                        <div className="text-xs text-muted-foreground text-right">{formatTime(duration)}</div>
                    </div>
                </div>
                {audioUrl && <audio ref={audioRef} src={audioUrl} />}
                <div className="flex gap-2">
                    <Button onClick={resetAudio} variant="destructive" className="w-full" type="button">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>
        )}

    </div>
  );
};

export default AudioRecorder;
