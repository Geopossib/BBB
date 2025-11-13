
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getArticles, getVideos, Article, Video } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Film, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [videos, articles] = await Promise.all([
          getVideos({ limit: 3 }),
          getArticles({ limit: 3 }),
        ]);
        setLatestVideos(videos);
        setLatestArticles(articles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/400/300`;
  };

  const getImageHint = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || 'placeholder image';
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-background text-primary-foreground py-20 md:py-32 flex items-center justify-center">
        <div className="absolute inset-0">
            <Image
                src="https://images.unsplash.com/photo-1545156521-39a583e2051f?q=80&w=2070&auto=format&fit=crop"
                alt="Connecting the world through faith"
                fill
                className="object-cover"
                data-ai-hint="connecting world"
            />
            <div className="absolute inset-0 bg-primary/70"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Welcome to BSN Connect</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
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
            </Button>.
          </div>
          {loading ? <LoadingSkeleton /> : (
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
          )}
        </section>

        {/* Recent Articles */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold">Recent Articles</h2>
            <Button variant="link" asChild className="text-accent-foreground">
              <Link href="/blog">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          {loading ? <LoadingSkeleton /> : (
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
          )}
        </section>
      </div>
    </div>
  );
}
