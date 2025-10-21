import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArticles, getVideos, getAudioFiles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Film, Mic, BookOpen } from 'lucide-react';

export default function Home() {
  const latestVideos = getVideos().slice(0, 3);
  const latestArticles = getArticles().slice(0, 3);
  const latestAudio = getAudioFiles().slice(0, 3);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/400/300';
  };

  const getImageHint = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || 'placeholder image';
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Welcome to BSN Connect</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Your home for spiritual growth. Explore inspiring videos, articles, and audio teachings from Bible Station Nigeria.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#latest-content">Explore Content</Link>
            </Button>
          </div>
        </div>
      </section>

      <div id="latest-content" className="container mx-auto px-4 py-16 space-y-16">
        {/* Latest Videos */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold">Latest Videos</h2>
            <Button variant="link" asChild className="text-accent-foreground">
              <Link href="/videos">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestVideos.map((video) => (
              <Link href={`/videos/${video.id}`} key={video.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <Image
                      src={getImage(video.thumbnailId)}
                      alt={video.title}
                      fill
                      className="object-cover"
                      data-ai-hint={getImageHint(video.thumbnailId)}
                    />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Film className="h-12 w-12 text-white/80" />
                     </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{video.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold">Recent Articles</h2>
            <Button variant="link" asChild className="text-accent-foreground">
              <Link href="/blog">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <Image
                      src={getImage(article.imageId)}
                      alt={article.title}
                      fill
                      className="object-cover"
                      data-ai-hint={getImageHint(article.imageId)}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white/80" />
                     </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* New Audio Teachings */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold">New Audio Teachings</h2>
            <Button variant="link" asChild className="text-accent-foreground">
              <Link href="/audio">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestAudio.map((audio) => (
              <Link href="/audio" key={audio.id} className="group">
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-secondary p-4 rounded-lg">
                      <Mic className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl flex-1">{audio.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{audio.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
