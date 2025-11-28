'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BookOpen, Video, Users, ArrowRight, Heart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-purple-100 px-6 py-3 text-sm font-semibold text-purple-800">
            <Sparkles className="w-5 h-5" /> Grow Closer to God Every Day
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-serif text-gray-900 leading-tight">
            Walk With Jesus<br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              One Day at a Time
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join a loving community discovering God’s Word through daily devotionals, anointed sermons, and heartfelt prayer.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold shadow-xl">
              <Link href="/signup">
                Start Free Today <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-10 py-7 border-2">
              <Link href="/login">I Already Have an Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, title: "Daily Bible Teaching", desc: "Fresh, Spirit-filled articles every morning" },
              { icon: Video, title: "Powerful Sermons", desc: "Watch life-changing messages anytime" },
              { icon: Heart, title: "Prayer Community", desc: "Share requests and pray together in love" },
            ].map((f) => (
              <Card key={f.title} className="text-center border-0 shadow-xl hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-6 w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <f.icon className="w-10 h-10 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-purple-900 to-blue-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold font-serif mb-8">
            Jesus Is Calling You Home
          </h2>
          <p className="text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
            Come just as you are. He’s been waiting.
          </p>
          <Button asChild size="lg" className="text-xl px-16 py-8 bg-white text-purple-900 hover:bg-gray-100 font-bold shadow-2xl">
            <Link href="/signup">
              Begin Your Journey Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}