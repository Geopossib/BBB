import { BsnConnectLogo } from '@/components/icons';
import Link from 'next/link';
import { Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      href: 'https://www.facebook.com/share/1AHEhjzhNa/',
      icon: Facebook,
      label: 'Facebook',
    },
    {
      href: 'https://x.com/_BSNGLOBAL?t=SNOo_Bsid8Z2qj6RM_oHwg&s=09',
      icon: Twitter,
      label: 'Twitter',
    },
    {
      href: 'https://youtube.com/@biblestation?si=Vm0nBk6N2RMOopaV',
      icon: Youtube,
      label: 'YouTube',
    },
  ];

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BsnConnectLogo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">BSN Connect</span>
          </div>
          <div className="flex space-x-4">
             {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.label}</span>
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Bible Station Nigeria. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
