
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArticles, getVideos, getDocuments } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Video, Users, Mail, Send } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Subscriber = {
    id: string;
    email: string;
    subscribedAt: Timestamp;
};

const newsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(10, 'Email body must be at least 10 characters'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function AdminDashboardPage() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [totalVideos, setTotalVideos] = useState(0);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingSubscribers, setLoadingSubscribers] = useState(true);
    const { toast } = useToast();

    const newsletterForm = useForm<NewsletterFormValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: { subject: '', body: '' },
    });

    useEffect(() => {
        async function loadStats() {
            try {
                const [articles, videos] = await Promise.all([
                    getArticles(),
                    getVideos(),
                ]);
                setTotalArticles(articles.length);
                setTotalVideos(videos.length);
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
            } finally {
                setLoadingStats(false);
            }
        }

        async function loadSubscribers() {
            setLoadingSubscribers(true);
            try {
                const subs = await getDocuments<Subscriber>('subscribers');
                setSubscribers(subs);
            } catch (error) {
                console.error("Error loading subscribers:", error);
            } finally {
                setLoadingSubscribers(false);
            }
        }
        
        loadStats();
        loadSubscribers();
    }, []);

    const onNewsletterSubmit: SubmitHandler<NewsletterFormValues> = (data) => {
        if (subscribers.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Subscribers',
                description: 'There are no subscribers to send a newsletter to.',
            });
            return;
        }

        const bccEmails = subscribers.map(s => s.email).join(',');
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(data.body);

        const mailtoLink = `mailto:?bcc=${bccEmails}&subject=${subject}&body=${body}`;

        // Using window.open to avoid exceeding URL length limits in some browsers
        window.open(mailtoLink, '_self');
    };

    const StatCard = ({ title, value, icon, isLoading }: { title: string, value: number, icon: React.ReactNode, isLoading: boolean }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );
    
    const formatDate = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <StatCard 
                            title="Total Articles"
                            value={totalArticles}
                            isLoading={loadingStats}
                            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                        />
                        <StatCard 
                            title="Total Videos"
                            value={totalVideos}
                            isLoading={loadingStats}
                            icon={<Video className="h-4 w-4 text-muted-foreground" />}
                        />
                         <StatCard 
                            title="Newsletter Subscribers"
                            value={subscribers.length}
                            isLoading={loadingSubscribers}
                            icon={<Users className="h-4 w-4 text-muted-foreground" />}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="subscribers">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Newsletter Subscribers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingSubscribers ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email Address</TableHead>
                                            <TableHead>Subscription Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscribers.map((subscriber) => (
                                            <TableRow key={subscriber.id}>
                                                <TableCell className="font-medium">{subscriber.email}</TableCell>
                                                <TableCell>{formatDate(subscriber.subscribedAt)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                             {subscribers.length === 0 && !loadingSubscribers && (
                                <p className="text-center text-muted-foreground py-8">No subscribers yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="newsletter">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Newsletter</CardTitle>
                            <CardDescription>Write your newsletter and open it in your default email client to send to all subscribers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...newsletterForm}>
                                <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="space-y-6">
                                    <FormField
                                        control={newsletterForm.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your newsletter subject" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={newsletterForm.control}
                                        name="body"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Body</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Write your message here..." className="min-h-[250px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={newsletterForm.formState.isSubmitting || loadingSubscribers}>
                                        <Send className="mr-2 h-4 w-4" />
                                        {newsletterForm.formState.isSubmitting ? 'Generating...' : `Open in Email Client (${subscribers.length})`}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
