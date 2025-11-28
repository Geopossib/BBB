'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useUser, useAuth, updateUserProfileAndPhoto } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Upload } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  photo: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
    if (user) {
      const nameParts = user.displayName?.split(' ') || ['', ''];
      form.reset({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      });
      if (user.photoURL) {
        setPhotoPreview(user.photoURL);
      }
    }
  }, [user, isUserLoading, router, form]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('photo', file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user || !auth) return;

    setIsUploading(true);
    let photoURL = user.photoURL;

    try {
      if (data.photo && data.photo instanceof File) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, data.photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await updateUserProfileAndPhoto(auth, data.firstName, data.lastName, photoURL);

      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">My Account</CardTitle>
          <CardDescription>Manage your profile details and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoPreview || user.photoURL || undefined} />
                  <AvatarFallback>
                    <UserIcon className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="relative mt-2">
                    <Input id="photo-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*" />
                    <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Picture
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" value={user.email || ''} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>

              <Button type="submit" disabled={isUploading || form.formState.isSubmitting}>
                {isUploading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
