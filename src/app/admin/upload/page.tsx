import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function UploadPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-6">Upload Content</h1>
      <Tabs defaultValue="article" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Article</CardTitle>
              <CardDescription>Fill in the details to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="article-title">Title</Label>
                <Input id="article-title" placeholder="The Power of Prayer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="article-author">Author</Label>
                <Input id="article-author" placeholder="Pastor John Doe" />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="article-category">Category</Label>
                <Input id="article-category" placeholder="Christian Living" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="article-image">Cover Image</Label>
                <Input id="article-image" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="article-content">Content</Label>
                <Textarea id="article-content" placeholder="Start writing your article here..." className="min-h-[200px]" />
              </div>
              <Button className="w-full md:w-auto">Upload Article</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="video">
           <Card>
            <CardHeader>
              <CardTitle>Upload New Video</CardTitle>
              <CardDescription>Provide the YouTube video details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="video-title">Title</Label>
                <Input id="video-title" placeholder="Sermon on Faith" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-url">YouTube URL</Label>
                <Input id="video-url" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-category">Category</Label>
                <Input id="video-category" placeholder="Sermons" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-description">Description</Label>
                <Textarea id="video-description" placeholder="A brief description of the video." />
              </div>
              <Button className="w-full md:w-auto">Add Video</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audio">
           <Card>
            <CardHeader>
              <CardTitle>Upload New Audio</CardTitle>
              <CardDescription>Upload an audio file and provide its details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="audio-title">Title</Label>
                <Input id="audio-title" placeholder="Daily Devotional" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio-file">Audio File</Label>
                <Input id="audio-file" type="file" accept="audio/*" />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="audio-category">Category</Label>
                <Input id="audio-category" placeholder="Devotionals" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audio-description">Description</Label>
                <Textarea id="audio-description" placeholder="A brief description of the audio file." />
              </div>
              <Button className="w-full md:w-auto">Upload Audio</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
