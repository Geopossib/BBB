
'use client';

import { useState, useEffect } from 'react';
import { getCourseById, getLessonsForCourse, Course, Lesson } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourseData() {
      try {
        const [fetchedCourse, fetchedLessons] = await Promise.all([
          getCourseById(params.courseId),
          getLessonsForCourse(params.courseId)
        ]);

        if (!fetchedCourse) {
          notFound();
        }

        setCourse(fetchedCourse);
        setLessons(fetchedLessons);
        if (fetchedLessons.length > 0) {
          setCurrentLesson(fetchedLessons[0]);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCourseData();
  }, [params.courseId]);

  const renderVideoPlayer = () => {
    if (!currentLesson?.youtubeUrl) {
      return <div className="w-full h-full rounded-lg shadow-xl bg-muted flex items-center justify-center"><p>Select a lesson to begin.</p></div>;
    }
    const videoId = getYoutubeVideoId(currentLesson.youtubeUrl);
    if (!videoId) {
      return <div className="w-full h-full rounded-lg shadow-xl bg-muted flex items-center justify-center"><p>Invalid YouTube URL for this lesson.</p></div>;
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <iframe
        src={embedUrl}
        title={currentLesson.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-xl"
      ></iframe>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 w-full">
            <Skeleton className="aspect-video w-full mb-4 rounded-lg" />
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
          <div className="lg:w-1/4 w-full">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return null; // notFound() is called in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:w-3/4 w-full">
          <div className="aspect-video w-full mb-6">
            {renderVideoPlayer()}
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{currentLesson?.title || course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
        </div>

        {/* Lesson Playlist */}
        <div className="lg:w-1/4 w-full">
          <div className="sticky top-20">
            <div className="bg-card border rounded-lg p-4">
              <h2 className="text-xl font-headline font-bold mb-4">{course.title}</h2>
               <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={cn(
                        "w-full text-left p-3 rounded-md transition-colors flex items-start gap-3",
                        currentLesson?.id === lesson.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      )}
                    >
                      <div className="flex-shrink-0 pt-1">
                        {currentLesson?.id === lesson.id ? (
                            <PlayCircle className="h-5 w-5 text-accent" />
                        ) : (
                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{lesson.title}</p>
                        <p className={cn("text-xs", currentLesson?.id === lesson.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                            Lesson {index + 1}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
