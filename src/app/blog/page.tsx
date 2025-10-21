import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

export default async function BlogPage() {
  const articles = await getArticles();

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/800/600';
  };
   const getImageHint = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id)?.imageHint || 'placeholder image';
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Articles & Teachings</h1>
        <p className="text-lg text-muted-foreground mt-2">Explore our collection of inspiring articles and devotionals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link href={`/blog/${article.slug}`} key={article.id} className="group">
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <Image
                  src={getImage(article.imageId)}
                  alt={article.title}
                  fill
                  className="object-cover"
                   data-ai-hint={getImageHint(article.imageId)}
                />
              </div>
              <CardHeader>
                <p className="text-sm text-muted-foreground">{article.category}</p>
                <CardTitle className="font-headline text-2xl mt-1">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-4">{article.excerpt}</p>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
