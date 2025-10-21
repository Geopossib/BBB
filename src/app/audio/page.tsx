import { getAudioFiles } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AudioPlayer from '@/components/AudioPlayer';
import { Badge } from '@/components/ui/badge';

export default async function AudioPage() {
  const audioFiles = await getAudioFiles();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Listen & Grow</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Daily devotionals, in-depth teachings, and guided prayers.
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {audioFiles.map((audio) => (
          <Card key={audio.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" className="mb-2">{audio.category}</Badge>
                    <CardTitle className="font-headline text-2xl">{audio.title}</CardTitle>
                  </div>
              </div>
              <CardDescription className="pt-2">{audio.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <AudioPlayer src={audio.audioUrl} duration={audio.duration} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
