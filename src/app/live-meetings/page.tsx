'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Facebook, Youtube } from 'lucide-react';
import Link from 'next/link';
import { getDocuments } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import type { Timestamp } from 'firebase/firestore';

type LiveMeeting = {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  createdAt: Timestamp;
};

// Custom icon for X (Twitter)
const XIcon = (props: React.ComponentProps<'svg'>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>X</title>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);


export default function LiveMeetingsPage() {
  const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetings() {
      try {
        const fetchedMeetings = await getDocuments<LiveMeeting>('liveMeetings');
        setMeetings(fetchedMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMeetings();
  }, []);

  const formatMeetingDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-1/2" />
                </CardContent>
                <CardFooter className="bg-secondary/50 px-6 py-4 flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </CardFooter>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Live Meetings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Connect with our community in real-time. Find upcoming events below.
        </p>
      </div>

      {loading ? <LoadingSkeleton /> : (
        <div className="max-w-4xl mx-auto space-y-8">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="overflow-hidden">
                <CardHeader>
                   <CardTitle className="font-headline text-2xl">{meeting.title}</CardTitle>
                   <CardDescription className="pt-2">{meeting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Posted on: {formatMeetingDate(meeting.createdAt)}</span>
                   </div>
                </CardContent>
                <CardFooter className="bg-secondary/50 px-6 py-4 flex flex-wrap items-center gap-4">
                  {meeting.youtubeUrl && (
                     <Button asChild>
                       <Link href={meeting.youtubeUrl} target="_blank" rel="noopener noreferrer">
                         <Youtube className="mr-2 h-5 w-5" />
                         Join on YouTube
                       </Link>
                     </Button>
                  )}
                  {meeting.facebookUrl && (
                     <Button asChild>
                       <Link href={meeting.facebookUrl} target="_blank" rel="noopener noreferrer">
                         <Facebook className="mr-2 h-5 w-5" />
                         Join on Facebook
                       </Link>
                     </Button>
                  )}
                   {meeting.twitterUrl && (
                     <Button asChild>
                       <Link href={meeting.twitterUrl} target="_blank" rel="noopener noreferrer">
                         <XIcon className="mr-2 h-5 w-5 fill-current" />
                         Join on X
                       </Link>
                     </Button>
                  )}
                  {!meeting.youtubeUrl && !meeting.facebookUrl && !meeting.twitterUrl && (
                    <p className="text-sm text-muted-foreground">No active links for this meeting yet.</p>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No upcoming meetings scheduled. Please check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
