
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Video, Heart, Users, Sparkles, Quote, ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { collection, getDocs, doc } from 'firebase/firestore';

const defaultVerse = {
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16"
};

type Verse = {
    text: string;
    reference: string;
};

export default function SpiritualHomepage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [readArticlesCount, setReadArticlesCount] = useState(0);
  const [watchedVideosCount, setWatchedVideosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // verseToDisplay will hold the verse currently shown, preventing flickering.
  const [verseToDisplay, setVerseToDisplay] = useState<Verse | null>(null);

  const verseDocRef = firestore ? doc(firestore, 'verseOfTheDay', 'current') : null;
  // useDoc fetches the latest data from Firestore.
  const { data: verseData, isLoading: isVerseLoading } = useDoc(verseDocRef);

  useEffect(() => {
    // Only update the displayed verse if the fetch is complete and we have new data.
    // If verseData is null after loading (i.e., no verse set in admin), use the default.
    if (!isVerseLoading) {
      setVerseToDisplay(verseData || defaultVerse);
    }
    // This effect runs whenever the live data (verseData) or loading state (isVerseLoading) changes.
  }, [verseData, isVerseLoading]);


  useEffect(() => {
    async function loadUserStats() {
      if (!user || !firestore) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const readArticlesRef = collection(firestore, 'users', user.uid, 'readArticles');
        const articlesSnapshot = await getDocs(readArticlesRef);
        setReadArticlesCount(articlesSnapshot.size);

        const watchedVideosRef = collection(firestore, 'users', user.uid, 'watchedVideos');
        const videosSnapshot = await getDocs(watchedVideosRef);
        setWatchedVideosCount(videosSnapshot.size);

      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUserStats();
  }, [user, firestore]);

  const StatCard = ({ title, value, icon, gradient }: any) => (
    <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className={`absolute inset-0 ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
      <CardHeader className="relative flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">{icon}</div>
      </CardHeader>
      <CardContent className="relative">
        {loading ? <Skeleton className="h-12 w-24 bg-white/30" /> : 
          <div className="text-4xl font-bold text-white">{value.toLocaleString()}</div>
        }
        <p className="text-white/80 text-sm mt-1">Total Tracked</p>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Hero + Verse */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-10 right-10 opacity-20"><Sparkles className="w-48 h-48 text-yellow-300" /></div>

        <div className="relative container mx-auto px-6 text-center z-10">
          <Badge className="mb-6 text-lg px-6 py-2 bg-white/20 backdrop-blur border-white/30 text-white">
            <Calendar className="w-5 h-5 mr-2" /> Verse of the Day
          </Badge>
          <div className="max-w-5xl mx-auto">
            <Quote className="w-16 h-16 mx-auto mb-8 text-yellow-300 opacity-70" />
            {!verseToDisplay ? (
                 <div className='space-y-4'>
                    <Skeleton className="h-16 w-full bg-white/20"/>
                    <Skeleton className="h-16 w-3/4 mx-auto bg-white/20"/>
                    <Skeleton className="h-8 w-1/4 mx-auto bg-white/20 mt-4"/>
                </div>
            ) : (
                <>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-serif">{verseToDisplay.text}</h1>
                    <p className="mt-8 text-2xl md:text-3xl text-yellow-200 font-medium">— {verseToDisplay.reference} —</p>
                </>
            )}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="text-lg px-10 bg-white text-purple-900 hover:bg-gray-100 font-bold shadow-2xl">
              <Link href="/blog">
                Start Reading Today <ArrowRight className="ml-3" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-10 border-2 border-white text-white hover:bg-white/20 backdrop-blur">
               <Link href="/prayer-and-counselling">
                <MessageCircle className="mr-3" /> Prayer Community
               </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-20 container mx-auto px-6 z-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Articles Read" value={readArticlesCount} icon={<BookOpen className="w-8 h-8 text-white" />} gradient="bg-gradient-to-br from-purple-600 to-pink-600" />
          <StatCard title="Videos Watched" value={watchedVideosCount} icon={<Video className="w-8 h-8 text-white" />} gradient="bg-gradient-to-br from-blue-600 to-cyan-600" />
          <StatCard title="Souls Encouraged" value={0} icon={<Heart className="w-8 h-8 text-white" />} gradient="bg-gradient-to-br from-red-600 to-pink-600" />
          <StatCard title="Faith Family" value={0} icon={<Users className="w-8 h-8 text-white" />} gradient="bg-gradient-to-br from-green-600 to-emerald-600" />
        </div>
      </section>
    </>
  );
}
