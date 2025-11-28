
'use client';

import { useState, useEffect } from 'react';
import { getArticles, Article } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function ManageArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadArticles() {
            setLoading(true);
            try {
                const fetchedArticles = await getArticles();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error loading articles:", error);
            } finally {
                setLoading(false);
            }
        }
        loadArticles();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    const LoadingSkeleton = () => (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Manage Articles</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Published Articles
                    </CardTitle>
                    <CardDescription>View and edit your existing articles.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Author</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date Published</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="font-medium">{article.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">{article.author}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{formatDate(article.date)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/manage/articles/edit/${article.id}`}>
                                                    <Pencil className="mr-2 h-3 w-3" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {articles.length === 0 && !loading && (
                        <p className="text-center text-muted-foreground py-8">No articles have been published yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
