'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

const audioSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    audioBlob: z.instanceof(Blob, { message: "An audio recording or file is required." }),
    duration: z.number().min(1, "Duration is required"),
});


type ArticleFormValues = z.infer<typeof articleSchema>;
type VideoFormValues = z.infer<typeof videoSchema>;
type AudioFormValues = z.infer<typeof audioSchema>;

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

  const audioForm = useForm<AudioFormValues>({
      resolver: zodResolver(audioSchema),
      defaultValues: { title: "", description: ""},
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

  const onAudioSubmit: SubmitHandler<AudioFormValues> = async (data) => {
    if (!firestore) return;
    audioForm.formState.isSubmitting = true;

    try {
      const storage = getStorage();
      const fileName = `audio/${Date.now()}-${data.title.replace(/\s+/g, '-')}.webm`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, data.audioBlob, { contentType: 'audio/webm' });
      const audioUrl = await getDownloadURL(storageRef);

      const audiosCollection = collection(firestore, 'audios');
      const audioData = {
        title: data.title,
        description: data.description,
        audioUrl: audioUrl,
        category: "Devotional",
        duration: `${Math.floor(data.duration / 60)}:${String(Math.floor(data.duration % 60)).padStart(2, '0')}`,
        createdAt: serverTimestamp(),
      };

      await addDoc(audiosCollection, audioData);
      
      toast({ title: "Success", description: "Audio uploaded successfully!" });
      audioForm.reset();

    } catch (error: any) {
      console.error("Audio upload failed:", error);
      
      if (error.code?.includes('storage')) {
         toast({ variant: "destructive", title: "Storage Error", description: "Could not upload audio file. Check storage rules." });
      } else if (error.name === 'FirebaseError') {
          // This will be handled by the global error listener
          const permissionError = new FirestorePermissionError({
            path: 'audios', // This is a collection path, adjust if needed
            operation: 'create',
            requestResourceData: data,
          });
          errorEmitter.emit('permission-error', permissionError);
      } else {
         toast({ variant: "destructive", title: "Error", description: error.message || "An unknown error occurred." });
      }
    } finally {
        audioForm.formState.isSubmitting = false;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === Infinity) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }


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
                    <Input id="article-image" type="file" />
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
            <CardContent>
               <Form {...audioForm}>
                <form onSubmit={audioForm.handleSubmit(onAudioSubmit)} className="space-y-4">
                  <FormField control={audioForm.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="Daily Devotional" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={audioForm.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="A brief description of the audio file." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={audioForm.control} name="audioBlob" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Audio</FormLabel>
                         <FormControl>
                            <AudioRecorder
                                onBlobChange={(blob, duration) => {
                                  field.onChange(blob);
                                  audioForm.setValue('duration', duration);
                                }}
                                onReset={() => {
                                  field.onChange(null);
                                  audioForm.setValue('duration', 0);
                                  audioForm.resetField('audioBlob');
                                }}
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                   )} />
                   <FormField control={audioForm.control} name="duration" render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel>Duration</FormLabel>
                        <FormControl><Input type="hidden" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                   )} />
                  <Button type="submit" className="w-full md:w-auto" disabled={audioForm.formState.isSubmitting}>
                     {audioForm.formState.isSubmitting ? "Uploading..." : "Upload Audio"}
                  </Button>
                </form>
              </Form>
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
