
'use client';
import Link from 'next/link';
import { LayoutDashboard, Settings, Video, PlusSquare, FileText } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { BsnConnectLogo } from '@/components/icons';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import Image from 'next/image';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/upload', label: 'Add Content', icon: PlusSquare },
    { href: '/admin/manage/articles', label: 'Manage Articles', icon: FileText },
    { href: '/admin/upload?tab=live-meeting', label: 'Live Meetings', icon: Video },
    { href: '#', label: 'Settings', icon: Settings },
];

const AUTHORIZED_EMAIL = 'goodeeamazon@gmail.com';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab');

  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Wait until the authentication check is complete.
    if (isUserLoading) {
      return;
    }

    // If there is no user, redirect to the admin login page.
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // If the user's email does not match the authorized email, alert and redirect to the homepage.
    if (user.email !== AUTHORIZED_EMAIL) {
      alert('You are not authorized as an admin.');
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const [path, tabQuery] = href.split('?tab=');
      return pathname === path && activeTab === tabQuery;
    }
    if (href === '/admin/upload' && activeTab && activeTab !== 'article' && activeTab !== 'video') {
        return false;
    }
     if (href === '/admin/manage/articles' && pathname.startsWith('/admin/manage/articles')) {
      return true;
    }
    return pathname === href;
  }

  // While loading, or if the user is not authenticated and authorized, show a verification screen.
  // This prevents the admin content from flashing before the redirect logic in useEffect completes.
  if (isUserLoading || !user || user.email !== AUTHORIZED_EMAIL) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                Verifying access...
            </div>
        </div>
    );
  }

  // If the user is authenticated and authorized, render the admin layout.
  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2">
            <Image src="https://i.ibb.co/pW6Vc7B/logo.png" alt="BSN Connect Logo" width={28} height={28} className="text-primary" />
            <span className="text-xl font-headline font-bold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
               <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton isActive={isActive(item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter/>
      </Sidebar>
      <SidebarInset>
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* You can add breadcrumbs or page titles here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
