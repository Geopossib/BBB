import Link from 'next/link';
import { Upload, LayoutDashboard, Settings, Video } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-secondary/80 border-r p-6">
        <h2 className="text-2xl font-headline font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/upload" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Upload className="h-4 w-4" />
            Upload Content
          </Link>
           <Link href="/live-meetings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Video className="h-4 w-4" />
            Live Meetings
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
