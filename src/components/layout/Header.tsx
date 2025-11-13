'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsnConnectLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Search, Menu, Home, Film, BookOpen, Video, ShieldCheck, GraduationCap, Users } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/blog', label: 'Articles', icon: BookOpen },
  { href: '/videos', label: 'Videos', icon: Film },
  { href: '/courses', label: 'Courses', icon: GraduationCap },
  { href: '/live-meetings', label: 'Live Meetings', icon: Video },
  { href: '/about', label: 'About Us', icon: Users },
];

export default function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-accent-foreground text-foreground/80',
        pathname === href && 'text-foreground font-semibold'
      )}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BsnConnectLogo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block font-headline">
              BSN Connect
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
              <BsnConnectLogo className="h-6 w-6" />
              <span className="font-bold font-headline">BSN Connect</span>
            </Link>
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md p-2 text-muted-foreground transition-colors hover:text-primary',
                    pathname === item.href && 'bg-muted text-primary font-semibold'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
               <Link
                href="/admin"
                className={cn(
                    'flex items-center gap-3 rounded-md p-2 text-muted-foreground transition-colors hover:text-primary',
                    pathname.startsWith('/admin') && 'bg-muted text-primary font-semibold'
                )}
                >
                <ShieldCheck className="h-5 w-5" />
                Admin
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"/>
                </div>
            </form>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
