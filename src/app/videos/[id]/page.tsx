
'use client';

import { useState, useEffect } from 'react';
import { getVideoById, getVideos, Video } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock, PlayCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    async function loadVideoData() {
      setLoading(true);
      try {
        const [fetchedVideo, fetchedAllVideos] = await Promise.all([
          getVideoById(params.id),
          getVideos({ limit: 10 }) // Fetch up to 10 other videos
        ]);

        if (!fetchedVideo) {
          notFound();
        }
        setVideo(fetchedVideo);
        setAllVideos(fetchedAllVideos.filter(v => v.id !== params.id)); // Exclude current video
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVideoData();
  }, [params.id]);

  useEffect(() => {
    // When the video has loaded and the user is logged in, record the view.
    if (video && user && firestore) {
      const watchedVideoRef = doc(firestore, 'users', user.uid, 'watchedVideos', video.id);
      setDoc(watchedVideoRef, { 
        videoId: video.id,
        watchedAt: serverTimestamp(),
        title: video.title,
      }, { merge: true });
    }
  }, [video, user, firestore]);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/400/225`;
  };

  const renderVideoPlayer = () => {
    if (!video) return null;
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
                        {[...Array(3)].map((_, i) => (
                           <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-20 w-32 rounded-md" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
  }

  if (!video) {
    return null; // Or some other not found component
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
            <div className="space-y-4">
                {allVideos.length > 0 ? (
                    allVideos.map(nextVideo => (
                        <Link href={`/videos/${nextVideo.id}`} key={nextVideo.id} className="group flex items-center gap-4 p-2 rounded-lg hover:bg-secondary transition-colors">
                            <div className="relative w-32 h-20 rounded-md overflow-hidden shrink-0">
                                <Image
                                    src={getImage(nextVideo.thumbnailId)}
                                    alt={nextVideo.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <PlayCircle className="h-8 w-8 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm line-clamp-2">{nextVideo.title}</p>
                                <p className="text-xs text-muted-foreground">{nextVideo.category}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-muted-foreground">No other videos available at the moment.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
