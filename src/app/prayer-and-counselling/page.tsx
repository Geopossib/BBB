'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HeartHandshake, Send } from 'lucide-react';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const requestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address.'),
  requestType: z.enum(["prayer", "counselling"], {
    required_error: "You need to select a request type.",
  }),
  message: z.string().min(10, 'Your message must be at least 10 characters long.'),
  isAnonymous: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (data.isAnonymous) {
    data.name = 'Anonymous';
  }
  if (!data.isAnonymous && (!data.name || data.name.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Name is required unless you are submitting anonymously.',
      });
  }
});

type RequestFormValues = z.infer<typeof requestSchema>;


export default function PrayerAndCounsellingPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      isAnonymous: false,
    },
  });

  const onSubmit: SubmitHandler<RequestFormValues> = (data) => {
    if (!firestore) return;

    const requestData = {
      name: data.isAnonymous ? 'Anonymous' : data.name,
      email: data.email,
      requestType: data.requestType,
      message: data.message,
      isAnonymous: data.isAnonymous,
      createdAt: serverTimestamp(),
      isRead: false,
    };

    const prayerRequestsCollection = collection(firestore, 'prayerRequests');
    addDoc(prayerRequestsCollection, requestData)
      .then(() => {
        toast({
          title: 'Request Sent',
          description: 'Thank you for reaching out. Your request has been received.',
        });
        form.reset();
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: prayerRequestsCollection.path,
          operation: 'create',
          requestResourceData: requestData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Card>
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <HeartHandshake className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Prayer & Counselling</CardTitle>
          <CardDescription className="text-lg">
            We are here for you. Please share your request, and our team will connect with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
               <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Submit Anonymously?
                      </FormLabel>
                       <p className="text-sm text-muted-foreground">
                        If you check this, your name will not be recorded.
                      </p>
                    </div>
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-5 w-5 rounded border-primary text-primary focus:ring-primary" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {!form.watch('isAnonymous') && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                        We will use this to get back to you. It will remain confidential.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What is the nature of your request?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="prayer" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Prayer Request
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="counselling" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Counselling
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Request</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share your prayer request or what you need counselling for..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">
                        Your request is confidential and will be handled with care.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Sending...' : 'Submit Request'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
