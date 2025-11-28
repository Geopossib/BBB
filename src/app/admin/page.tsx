
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArticles, getVideos, getDocuments } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Video, Users, Mail } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

type Subscriber = {
    id: string;
    email: string;
    subscribedAt: Timestamp;
};

export default function AdminDashboardPage() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [totalVideos, setTotalVideos] = useState(0);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingSubscribers, setLoadingSubscribers] = useState(true);

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
    
    const formatDate = (timestamp: Timestamp) => {
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
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
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
            </Tabs>
        </div>
    );
}
