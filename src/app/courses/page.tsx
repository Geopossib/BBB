
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCourses, Course } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="overflow-hidden h-full flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Courses</h1>
        <p className="text-lg text-muted-foreground mt-2">Deepen your knowledge and grow your faith with our structured courses.</p>
      </div>
      {loading ? <LoadingSkeleton /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="group">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnailUrl || `https://picsum.photos/seed/${course.id}/400/225`}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <Book className="h-16 w-16 text-white/80 transform transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {course.lessonCount} Lessons
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-xl mt-1">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{course.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
