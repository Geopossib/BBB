'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

// Mock data for now, this will be replaced with Firestore data
const mockMeetings = [
  {
    id: '1',
    title: 'Weekly Bible Study',
    description: 'Join us as we dive deep into the book of Romans. All are welcome!',
    startTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString(),
    meetingUrl: '#',
  },
  {
    id: '2',
    title: 'Leadership Prayer Meeting',
    description: 'A dedicated time for church leaders to come together in prayer.',
    startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(new Date().getTime() + 25 * 60 * 60 * 1000).toISOString(),
    meetingUrl: '#',
  },
    {
    id: '3',
    title: 'Youth Fellowship Night',
    description: 'Fun, games, and a powerful word for the next generation.',
    startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(new Date().getTime() + 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    meetingUrl: '#',
  },
];

export default function LiveMeetingsPage() {
  const [meetings, setMeetings] = useState(mockMeetings);

  const formatMeetingTime = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return `${startTime.toLocaleTimeString('en-US', options)} - ${endTime.toLocaleTimeString('en-US', options)}`;
  };
    const formatMeetingDate = (start: string) => {
    const startTime = new Date(start);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return startTime.toLocaleDateString('en-US', options);
  };


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Live Meetings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Connect with our community in real-time. Find upcoming events below.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <Card key={meeting.id} className="overflow-hidden">
              <CardHeader>
                 <CardTitle className="font-headline text-2xl">{meeting.title}</CardTitle>
                 <CardDescription className="pt-2">{meeting.description}</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatMeetingDate(meeting.startTime)}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatMeetingTime(meeting.startTime, meeting.endTime)}</span>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="bg-secondary/50 px-6 py-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/whatsapp-connect">
                    Join Meeting
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No upcoming meetings scheduled. Please check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
