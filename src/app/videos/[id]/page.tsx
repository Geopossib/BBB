
'use client';

import { useState, useEffect } from 'react';
import { getVideoById, Video } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


type VideoPageProps = {
  params: {
    id: string;
  };
};

function getYoutubeVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


export default function VideoPage({ params }: VideoPageProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideo() {
      try {
        const fetchedVideo = await getVideoById(params.id);
        if (!fetchedVideo) {
          notFound();
        }
        setVideo(fetchedVideo);
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideo();
  }, [params.id]);


  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 w-full">
                    <Skeleton className="aspect-video w-full mb-4 rounded-lg" />
                     <div className="bg-card border rounded-lg p-6">
                        <Skeleton className="h-5 w-24 mb-4" />
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-5 w-full" />
                     </div>
                </div>
                 <div className="lg:w-1/3 w-full">
                    <h2 className="text-2xl font-headline font-bold mb-4">More Videos</h2>
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  if (!video) {
    return null; // Or some other not found component
  }

  const renderVideoPlayer = () => {
    if (video.youtubeUrl) {
       const videoId = getYoutubeVideoId(video.youtubeUrl);
       if (!videoId) {
           return <div className="w-full h-full rounded-lg shadow-xl bg-muted flex items-center justify-center"><p>Invalid YouTube URL.</p></div>
       }
       const embedUrl = `https://www.youtube.com/embed/${videoId}`;
       return (
        <iframe
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-xl"
        ></iframe>
       )
    }
    return <div className="w-full h-full rounded-lg shadow-xl bg-muted flex items-center justify-center"><p>Video source not available.</p></div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 w-full">
          <div className="aspect-video w-full mb-4">
            {renderVideoPlayer()}
          </div>
          <div className="bg-card border rounded-lg p-6">
             <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge variant="secondary">{video.category}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {video.duration}</span>
                </div>
             </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{video.title}</h1>
            <p className="text-lg text-muted-foreground">{video.description}</p>
          </div>
        </div>
        <div className="lg:w-1/3 w-full">
            <h2 className="text-2xl font-headline font-bold mb-4">More Videos</h2>
            {/* Here you could map over other videos to create a playlist */}
            <p className="text-muted-foreground">More videos coming soon.</p>
        </div>
      </div>
    </div>
  );
}
