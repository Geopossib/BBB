
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HeartHandshake, Send } from 'lucide-react';

const requestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address.'),
  requestType: z.enum(["prayer", "counselling"], {
    required_error: "You need to select a request type.",
  }),
  message: z.string().min(10, 'Your message must be at least 10 characters long.'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const RECIPIENT_EMAIL = 'goodeeamazon@gmail.com';

export default function PrayerAndCounsellingPage() {
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<RequestFormValues> = (data) => {
    const subject = data.requestType === 'prayer' ? 'New Prayer Request' : 'New Counselling Request';
    const body = `
      New Request Received:
      --------------------------
      Name: ${data.name || 'Anonymous'}
      Email: ${data.email}
      Request Type: ${data.requestType}
      --------------------------
      Message:
      ${data.message}
    `;

    const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the user's default email client
    window.location.href = mailtoLink;
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                        We will use this to get back to you.
                    </FormDescription>
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
                     <FormDescription>
                        Your request is confidential and will be handled with care.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
