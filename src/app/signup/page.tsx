
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, initiateGoogleSignIn, useUser, initiateEmailSignUp } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // Redirect if user is fully loaded AND already authenticated (non-anonymous)
  useEffect(() => {
    if (!isUserLoading && user && !user.isAnonymous) {
      router.replace('/'); // replace so they can't go back to signup
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      // Success redirect is handled by the auth state listener and the useEffect above
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    if (!auth) return;

    try {
      await initiateEmailSignUp(auth, data.email, data.password, data.firstName, data.lastName);

      toast({
        title: 'Welcome!',
        description: `Account created successfully, ${data.firstName}!`,
      });
      // The useEffect hook will handle the redirect on the next render
    } catch (error: any) {
      let description = 'An unexpected error occurred.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          description = 'This email is already in use. Please try logging in.';
          break;
        case 'auth/weak-password':
          description = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          description = 'The email address is not valid.';
          break;
        default:
          description = error.message || description;
      }

      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description,
      });
    }
  };

  // Show a loading state while checking the user's auth status
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is already logged in (non-anonymous), render nothing while redirect happens
  if (user && !user.isAnonymous) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-headline">Create an account</CardTitle>
          <CardDescription>Enter your details below to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max" autoFocus {...field} />
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Robinson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={form.formState.isSubmitting || isGoogleLoading}
              >
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create account'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || form.formState.isSubmitting}
              >
                {isGoogleLoading ? 'Signing in...' : 'Sign up with Google'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
