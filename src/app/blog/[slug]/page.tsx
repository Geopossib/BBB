
'use client';

import { useState, useEffect } from 'react';
import { getArticleBySlug, Article } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = params;
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const fetchedArticle = await getArticleBySlug(slug);
        if (!fetchedArticle) {
          notFound();
        }
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  useEffect(() => {
    // When the article has loaded and the user is logged in, record the view.
    if (article && user && firestore) {
      const readArticleRef = doc(firestore, 'users', user.uid, 'readArticles', article.id);
      // Use setDoc with merge to create or update without overwriting,
      // and to avoid writing the same data repeatedly.
      setDoc(readArticleRef, { 
        articleId: article.id,
        readAt: serverTimestamp(),
        title: article.title, // Storing title for potential future use
      }, { merge: true });
    }
  }, [article, user, firestore]);

  if (loading) {
    return (
      <div>
        <header className="relative h-[40vh] md:h-[50vh] w-full">
            <Skeleton className="h-full w-full"/>
        </header>
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto py-8">
                 <div className="flex items-center space-x-6 text-muted-foreground mb-8 border-b pb-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                 </div>
                 <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                 </div>
            </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return null;
  }

  const imageUrl = PlaceHolderImages.find((img) => img.id === article.imageId)?.imageUrl || 'https://picsum.photos/seed/placeholder/1200/800';
  const imageHint = PlaceHolderImages.find((img) => img.id === article.imageId)?.imageHint || 'placeholder';

  return (
    <article>
      <header className="relative h-[40vh] md:h-[50vh] w-full">
        <Image src={imageUrl} alt={article.title} fill className="object-cover" data-ai-hint={imageHint}/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-end container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
                 <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                <h1 className="text-3xl md:text-5xl font-headline font-bold text-foreground">
                    {article.title}
                </h1>
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center space-x-6 text-muted-foreground mb-8 border-b pb-4">
                 <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
          <div
            className="prose dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:font-headline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </article>
  );
}
