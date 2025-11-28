
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

const liveMeetingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
});

type LiveMeetingFormValues = z.infer<typeof liveMeetingSchema>;

export default function LiveMeetingForm() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<LiveMeetingFormValues>({
    resolver: zodResolver(liveMeetingSchema),
    defaultValues: {
      title: '',
      description: '',
      youtubeUrl: '',
      facebookUrl: '',
      twitterUrl: '',
    },
  });

  const onSubmit: SubmitHandler<LiveMeetingFormValues> = (data) => {
    if (!firestore) return;

    // Filter out empty URL fields
    const meetingData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const liveMeetingsCollection = collection(firestore, 'liveMeetings');
    
    addDoc(liveMeetingsCollection, meetingData)
      .then(() => {
        toast({ title: 'Success', description: 'Live meeting scheduled successfully!' });
        form.reset();
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: liveMeetingsCollection.path,
            operation: 'create',
            requestResourceData: meetingData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Live Meeting</CardTitle>
        <CardDescription>
          Provide links to your live streams on social media. Users will be directed to these platforms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sunday Morning Service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the meeting." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/live/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Live URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/live/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (Twitter) Space URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/i/spaces/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating...' : 'Create Meeting'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
