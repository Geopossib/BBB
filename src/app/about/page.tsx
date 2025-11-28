'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye, HeartHandshake } from 'lucide-react';

const teamMembers = [
    {
        name: 'Pastor John Doe',
        role: 'Senior Pastor',
        imageUrl: 'https://picsum.photos/seed/pastor1/400/400'
    },
    {
        name: 'Jane Smith',
        role: 'Music Director',
        imageUrl: 'https://picsum.photos/seed/director1/400/400'
    },
    {
        name: 'Samuel Green',
        role: 'Youth Coordinator',
        imageUrl: 'https://picsum.photos/seed/youth1/400/400'
    }
];

const coreValues = [
    "Love",
    "Prayer",
    "Devotion to God's Word",
    "Reaching out to those in need",
    "Kindness"
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col">
       <section className="relative h-[40vh] w-full flex items-center justify-center bg-primary text-primary-foreground">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: "url('https://picsum.photos/seed/about-hero/1600/800')" }}
                data-ai-hint="team collaboration"
            ></div>
            <div className="relative container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-bold">About Us</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
                    Rise and Shine. We are The Bible Station Network International - the center of transformation.
                </p>
            </div>
        </section>

      <main className="container mx-auto px-4 py-16">
        
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="flex flex-col items-center text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                         <Eye className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Vision Statement</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Our aim is to nurture men and women who will become rooted in the Word of God and prayer, who will stand to fight the good fight of faith in this end time until Christ comes.
                    </p>
                </CardContent>
            </Card>
             <Card className="flex flex-col items-center text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit mb-4">
                        <Target className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Mission Statement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p>To raise broken and battered men and women who will become a tool in the hands of God to expand God's kingdom and expose the evil agenda of the devil.</p>
                    <p>To reach out to the lost souls.</p>
                    <p>To create a system by which men and women can be built strong in prayer and the Word.</p>
                </CardContent>
            </Card>
        </section>

        {/* Core Values */}
        <section className="mb-16">
            <Card className="p-6">
                <CardHeader className="text-center">
                     <div className="mx-auto bg-secondary p-4 rounded-full w-fit mb-4">
                        <HeartHandshake className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Our Core Values</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-4xl mx-auto text-lg">
                        {coreValues.map(value => (
                            <li key={value} className="flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <span>{value}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </section>

        {/* Meet the Team */}
        <section>
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold mb-8">Meet the Team</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {teamMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                    <div className="relative aspect-square">
                        <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4 text-center">
                        <p className="text-lg font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardContent>
                </Card>
               ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
