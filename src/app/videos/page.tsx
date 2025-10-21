
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getVideos, Video } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const fetchedVideos = await getVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/400/225`;
  };
  const getImageHint = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || 'placeholder';
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Watch & Be Inspired</h1>
        <p className="text-lg text-muted-foreground mt-2">Browse our library of sermons, discussions, and worship sessions.</p>
      </div>
      {loading ? <LoadingSkeleton /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Link href={`/videos/${video.id}`} key={video.id} className="group">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-video">
                  <Image
                    src={getImage(video.thumbnailId)}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={getImageHint(video.thumbnailId)}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white/80 transform transition-transform duration-300 group-hover:scale-110" />
                  </div>
                   <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                   <p className="text-sm text-muted-foreground">{video.category}</p>
                  <CardTitle className="font-headline text-xl mt-1">{video.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{video.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
