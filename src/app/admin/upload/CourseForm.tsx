
'use client';

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  youtubeUrl: z.string().url('Please enter a valid YouTube URL'),
});

const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Course description is required'),
  thumbnailUrl: z.string().url('Please enter a valid image URL for the thumbnail'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CourseForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnailUrl: '',
      lessons: [{ title: '', youtubeUrl: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lessons',
  });

  const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const batch = writeBatch(firestore);
    
    // 1. Create a reference for the new course document
    const courseCollection = collection(firestore, 'courses');
    const courseDocRef = doc(courseCollection); // Create a new doc ref with a unique ID

    // 2. Set the data for the new course document in the batch
    const courseData = {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lessonCount: data.lessons.length,
    };
    batch.set(courseDocRef, courseData);

    // 3. Create references and set data for each lesson in the subcollection
    data.lessons.forEach((lesson, index) => {
        const lessonDocRef = doc(courseDocRef, 'lessons', (index + 1).toString());
        batch.set(lessonDocRef, {
          ...lesson,
          order: index + 1,
          createdAt: serverTimestamp(),
        });
    });

    try {
      // 4. Commit the batch
      await batch.commit();
      toast({ title: 'Success', description: 'Course created successfully!' });
      form.reset();
    } catch (error: any) {
      console.error('Error creating course with batch: ', error);
      // Create and emit the detailed permission error
      const permissionError = new FirestorePermissionError({
          path: `courses/${courseDocRef.id}`, // Path for the main document
          operation: 'create', // The batch write is a create operation
          requestResourceData: {
            course: courseData,
            lessons: data.lessons,
          }
      });
      errorEmitter.emit('permission-error', permissionError);

      // Show a generic error toast to the user
      toast({
          variant: 'destructive',
          title: 'Error Creating Course',
          description: 'You do not have the required permissions. Please check the console for details.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>
          Build a new course by adding lessons with YouTube video links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Theology" {...field} />
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
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary of what this course is about." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-2">Lessons</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md relative">
                     <span className="text-sm font-bold text-muted-foreground absolute -top-2 left-2 bg-background px-1">{index + 1}</span>
                    <div className="flex-grow space-y-2">
                       <FormField
                        control={form.control}
                        name={`lessons.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel className="sr-only">Lesson Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Lesson Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lessons.${index}.youtubeUrl`}
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel className="sr-only">YouTube URL</FormLabel>
                            <FormControl>
                              <Input placeholder="YouTube URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ title: '', youtubeUrl: '' })}
                  className="mt-4"
                >
                  Add Lesson
                </Button>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
