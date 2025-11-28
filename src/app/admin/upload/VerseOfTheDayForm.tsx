
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { useEffect } from 'react';

const verseSchema = z.object({
  text: z.string().min(1, 'Verse text is required'),
  reference: z.string().min(1, 'Verse reference is required'),
});

type VerseFormValues = z.infer<typeof verseSchema>;

export default function VerseOfTheDayForm() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<VerseFormValues>({
    resolver: zodResolver(verseSchema),
    defaultValues: {
      text: '',
      reference: '',
    },
  });

  const verseDocRef = firestore ? doc(firestore, 'verseOfTheDay', 'current') : null;
  const { data: currentVerse, isLoading } = useDoc<VerseFormValues>(verseDocRef);

  useEffect(() => {
    if (currentVerse) {
      form.reset({
        text: currentVerse.text,
        reference: currentVerse.reference,
      });
    }
  }, [currentVerse, form]);


  const onSubmit: SubmitHandler<VerseFormValues> = (data) => {
    if (!verseDocRef) return;

    const verseData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    
    setDoc(verseDocRef, verseData)
      .then(() => {
        toast({ title: 'Success', description: 'Verse of the Day has been updated!' });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: verseDocRef.path,
            operation: 'write',
            requestResourceData: verseData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Verse of the Day</CardTitle>
        <CardDescription>
          Set the verse that will appear on the user dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verse Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isLoading ? "Loading current verse..." : "For God so loved the world..."}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isLoading ? "Loading..." : "John 3:16"}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting || isLoading}>
              {form.formState.isSubmitting ? 'Updating...' : 'Update Verse'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
