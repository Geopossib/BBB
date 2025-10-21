import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles, getVideos, getAudioFiles } from "@/lib/data";

export default function AdminDashboardPage() {
    const totalArticles = getArticles().length;
    const totalVideos = getVideos().length;
    const totalAudio = getAudioFiles().length;

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalArticles}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 13l-4 4-4-4"></path><path d="M12 3v14"></path></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVideos}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Audio Files</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAudio}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                {/* Additional dashboard components can be added here */}
            </div>
        </div>
    );
}
