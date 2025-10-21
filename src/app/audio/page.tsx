
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import type { AudioFile } from '@/lib/data';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AudioPlayer from '@/components/AudioPlayer';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AudioPage() {
  const firestore = useFirestore();
  const audiosQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'audios');
  }, [firestore]);

  const { data: audioFiles, isLoading } = useCollection<AudioFile>(audiosQuery);


  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Listen & Grow</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Daily devotionals, in-depth teachings, and guided prayers.
        </p>
      </div>
      {isLoading ? <LoadingSkeleton /> : (
        <div className="max-w-4xl mx-auto space-y-6">
          {audioFiles && audioFiles.map((audio) => (
            <Card key={audio.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">{audio.category}</Badge>
                      <CardTitle className="font-headline text-2xl">{audio.title}</CardTitle>
                    </div>
                </div>
                <CardDescription className="pt-2">{audio.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlayer src={audio.audioUrl} duration={audio.duration} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
