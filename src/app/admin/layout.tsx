
'use client';
import Link from 'next/link';
import { LayoutDashboard, Settings, Video, PlusSquare } from 'lucide-react';
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

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/upload', label: 'Add Content', icon: PlusSquare },
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
    if (isUserLoading) {
      // Still checking authentication, do nothing yet.
      return;
    }

    if (!user) {
      // If there's no user after loading, redirect to admin login.
      router.push('/admin/login');
    } else if (user.email !== AUTHORIZED_EMAIL) {
      // If there is a user but they are not the authorized admin, redirect to homepage.
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
    return pathname === href;
  }

  // While loading or if user is not authorized, show a loading/verification screen.
  // This prevents content from flashing before the redirect happens.
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

  return (
     <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2">
            <BsnConnectLogo className="size-7 text-primary" />
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
