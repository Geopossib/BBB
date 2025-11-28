
'use client';

import { collection, getDocs, doc, getDoc, query, orderBy, limit as queryLimit, where, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Timestamp } from 'firebase/firestore';

// Initialize Firestore on the client
let firestore: any;
try {
  firestore = initializeFirebase().firestore;
} catch (e) {
  console.error("Could not initialize Firebase on the client.", e);
}


export type Article = {
  id: string;
  title: string;
  slug: string;
  author: string;
  date: string; // Should be ISO string
  imageId: string;
  excerpt: string;
  content: string;
  category: string;
  createdAt: Timestamp;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string; // For direct uploads
  youtubeUrl?: string; // For youtube links
  thumbnailId: string;
  category: string;
  duration: string;
  createdAt: Timestamp;
};

export type Course = {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    lessonCount: number;
    createdAt: Timestamp;
};

export type Lesson = {
    id: string;
    title: string;
    youtubeUrl: string;
    order: number;
    createdAt: Timestamp;
};


export async function getDocuments<T>(collectionName: string, options?: { limit?: number }): Promise<T[]> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return [];
  }
  const colRef = collection(firestore, collectionName);
  
  // Use 'subscribedAt' for subscribers, 'createdAt' for others.
  const orderByField = collectionName === 'subscribers' ? 'subscribedAt' : 'createdAt';
  
  const q = options?.limit 
    ? query(colRef, orderBy(orderByField, 'desc'), queryLimit(options.limit))
    : query(colRef, orderBy(orderByField, 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}


export async function getArticles(options?: { limit?: number }): Promise<Article[]> {
  const articles = await getDocuments<Article>('articles', options);
  return articles.map(article => ({
    ...article,
    date: (article.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
  }));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    if (!firestore) {
      console.error("Firestore is not initialized.");
      return undefined;
    }
    const docRef = doc(firestore, 'articles', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return undefined;
    }
    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        date: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Article;
}


export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (!firestore) {
      console.error("Firestore is not initialized.");
      return undefined;
    }
    const articlesCol = collection(firestore, 'articles');
    const q = query(articlesCol, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return undefined;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        date: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Article;
}


export async function getVideos(options?: { limit?: number }): Promise<Video[]> {
  return getDocuments<Video>('videos', options);
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return undefined;
  }
  const docRef = doc(firestore, 'videos', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Video : undefined;
}


export async function getCourses(options?: { limit?: number }): Promise<Course[]> {
  return getDocuments<Course>('courses', options);
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return undefined;
  }
  const docRef = doc(firestore, 'courses', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Course : undefined;
}

export async function getLessonsForCourse(courseId: string): Promise<Lesson[]> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return [];
  }
  const lessonsColRef = collection(firestore, 'courses', courseId, 'lessons');
  const q = query(lessonsColRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
}

export async function updateArticle(id: string, data: Partial<Article>) {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    throw new Error("Firestore not initialized");
  }
  const docRef = doc(firestore, 'articles', id);
  await updateDoc(docRef, data);
}
