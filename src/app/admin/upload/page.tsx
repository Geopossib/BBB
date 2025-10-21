'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AudioRecorder from '@/components/AudioRecorder';
import LiveMeetingForm from './LiveMeetingForm';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  // image will be handled separately
});

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Please enter a valid YouTube URL"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;
type VideoFormValues = z.infer<typeof videoSchema>;

export default function UploadPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || "article");
  const { toast } = useToast();
  const firestore = useFirestore();

  const articleForm = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: "", author: "", category: "", content: "" },
  });

  const videoForm = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
     defaultValues: { title: "", description: "", url: "" },
  });

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);
  
  const onArticleSubmit: SubmitHandler<ArticleFormValues> = (data) => {
    if (!firestore) return;

    const articlesCollection = collection(firestore, 'articles');
    const articleData = {
      ...data,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      imageId: `article-image-${Math.floor(Math.random() * 4) + 1}`, // Temporary
      excerpt: data.content.substring(0, 150),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDoc(articlesCollection, articleData)
      .then(() => {
        toast({ title: "Success", description: "Article uploaded successfully!" });
        articleForm.reset();
      })
      .catch(error => {
        const permissionError = new FirestorePermissionError({
          path: articlesCollection.path,
          operation: 'create',
          requestResourceData: articleData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const onVideoSubmit: SubmitHandler<VideoFormValues> = (data) => {
    if (!firestore) return;
    
    const videosCollection = collection(firestore, 'videos');
    const videoData = {
      title: data.title,
      description: data.description,
      youtubeUrl: data.url,
      thumbnailId: `video-thumb-${Math.floor(Math.random() * 3) + 1}`, // Temporary
      category: 'General', // Temporary
      duration: '00:00', // Temporary
      createdAt: serverTimestamp(),
    };
    
    addDoc(videosCollection, videoData)
      .then(() => {
        toast({ title: "Success", description: "Video added successfully!" });
        videoForm.reset();
      })
      .catch(error => {
        const permissionError = new FirestorePermissionError({
          path: videosCollection.path,
          operation: 'create',
          requestResourceData: videoData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-6">Upload Content</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="live-meeting">Live Meeting</TabsTrigger>
        </TabsList>
        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Article</CardTitle>
              <CardDescription>Fill in the details to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...articleForm}>
                <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-4">
                  <FormField control={articleForm.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="The Power of Prayer" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={articleForm.control} name="author" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl><Input placeholder="Pastor John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={articleForm.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl><Input placeholder="Christian Living" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid gap-2">
                    <Label htmlFor="article-image">Cover Image</Label>
                    <Input id="article-image" type="file" disabled />
                  </div>
                  <FormField control={articleForm.control} name="content" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl><Textarea placeholder="Start writing your article here..." className="min-h-[200px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full md:w-auto" disabled={articleForm.formState.isSubmitting}>
                    {articleForm.formState.isSubmitting ? 'Uploading...' : 'Upload Article'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="video">
           <Card>
            <CardHeader>
              <CardTitle>Upload New Video</CardTitle>
              <CardDescription>Upload a video file or provide a YouTube URL.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...videoForm}>
                <form onSubmit={videoForm.handleSubmit(onVideoSubmit)} className="space-y-4">
                  <FormField control={videoForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="Sermon on Faith" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={videoForm.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="A brief description of the video." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  
                  <Tabs defaultValue="youtube" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="youtube">YouTube</TabsTrigger>
                      <TabsTrigger value="upload" disabled>Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="youtube" className="pt-4">
                      <FormField control={videoForm.control} name="url" render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL</FormLabel>
                          <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </TabsContent>
                    <TabsContent value="upload" className="pt-4">
                       <div className="grid gap-2">
                        <Label htmlFor="video-file">Video File</Label>
                        <Input id="video-file" type="file" accept="video/*" disabled />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <Button type="submit" className="w-full md:w-auto" disabled={videoForm.formState.isSubmitting}>
                    {videoForm.formState.isSubmitting ? 'Adding...' : 'Add Video'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audio">
           <Card>
            <CardHeader>
              <CardTitle>Upload New Audio</CardTitle>
              <CardDescription>Record a new audio file or upload an existing one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                <Label htmlFor="audio-title">Title</Label>
                <Input id="audio-title" placeholder="Daily Devotional" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio-description">Description</Label>
                <Textarea id="audio-description" placeholder="A brief description of the audio file." />
              </div>

              <AudioRecorder />
              
              <Button className="w-full md:w-auto">Upload Audio</Button>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="live-meeting">
          <LiveMeetingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
