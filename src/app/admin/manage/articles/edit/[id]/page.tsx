
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getArticleById, updateArticle, Article } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
  });

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedArticle = await getArticleById(id);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
          form.reset({
            title: fetchedArticle.title,
            author: fetchedArticle.author,
            category: fetchedArticle.category,
            content: fetchedArticle.content,
          });
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Article not found.' });
          router.push('/admin/manage/articles');
        }
      } catch (error) {
        console.error("Error loading article:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load article.' });
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id, form, router, toast]);

  const onSubmit: SubmitHandler<ArticleFormValues> = async (data) => {
    try {
      const updatedData = {
          ...data,
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
          excerpt: data.content.substring(0, 150),
      };
      await updateArticle(id, updatedData);
      toast({ title: 'Success', description: 'Article updated successfully!' });
      router.push('/admin/manage/articles');
    } catch (error) {
      console.error("Error updating article:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update article.' });
    }
  };
  
  if (loading) {
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Edit Article</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div>
        <h1 className="text-3xl font-headline font-bold mb-6">Edit Article</h1>
        <Card>
            <CardHeader>
                <CardTitle>{article?.title}</CardTitle>
                <CardDescription>Make changes to the article below and save.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="The Power of Prayer" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="author" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl><Input placeholder="Pastor John Doe" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl><Input placeholder="Christian Living" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="content" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl><Textarea placeholder="Start writing your article here..." className="min-h-[300px]" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
