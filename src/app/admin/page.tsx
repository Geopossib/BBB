
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles, getVideos } from "@/lib/data";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
    const [totalArticles, setTotalArticles] = useState(0);
    const [totalVideos, setTotalVideos] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [articles, videos] = await Promise.all([
                    getArticles(),
                    getVideos(),
                ]);
                setTotalArticles(articles.length);
                setTotalVideos(videos.length);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
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

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total Articles"
                    value={totalArticles}
                    isLoading={loading}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
                />
                <StatCard 
                    title="Total Videos"
                    value={totalVideos}
                    isLoading={loading}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 13l-4 4-4-4"></path><path d="M12 3v14"></path></svg>}
                />
            </div>
            <div className="mt-8">
                {/* Additional dashboard components can be added here */}
            </div>
        </div>
    );
}
