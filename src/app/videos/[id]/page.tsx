import { getVideoById, getVideos } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

type VideoPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((video) => ({
    id: video.id,
  }));
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideoById(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 w-full">
          <div className="aspect-video w-full mb-4">
            <iframe
              src={video.youtubeUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-xl"
            ></iframe>
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
