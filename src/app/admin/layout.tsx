'use client';
import Link from 'next/link';
import { Upload, LayoutDashboard, Settings, Video } from 'lucide-react';
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
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/upload', label: 'Upload Content', icon: Upload },
    { href: '/admin/upload?tab=live-meeting', label: 'Live Meetings', icon: Video },
    { href: '#', label: 'Settings', icon: Settings },
];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab');

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const [path, tabQuery] = href.split('?tab=');
      return pathname === path && activeTab === tabQuery;
    }
    if (href === '/admin/upload' && activeTab) {
        return false;
    }
    return pathname === href;
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
                <SidebarMenuButton asChild isActive={isActive(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
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
