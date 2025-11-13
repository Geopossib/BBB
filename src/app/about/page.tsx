'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye } from 'lucide-react';

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
                    Learn about our mission, vision, and the team dedicated to spreading the Word.
                </p>
            </div>
        </section>

      <main className="container mx-auto px-4 py-16">
        {/* Our Story Section */}
        <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-headline font-bold mb-4">Our Story</h2>
                <p className="text-lg text-muted-foreground">
                    Content for your story will go here. You can describe how your organization started, its history, and what drives you forward. Just let me know what you want to write!
                </p>
            </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="flex flex-col items-center text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit mb-4">
                        <Target className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This is a placeholder for your mission statement. Tell me what your core purpose is, and I'll place it here.
                    </p>
                </CardContent>
            </Card>
             <Card className="flex flex-col items-center text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                         <Eye className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This is where your vision statement will live. Describe the future you are working to create.
                    </p>
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
