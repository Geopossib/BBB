
'use client';

import { collection, getDocs, doc, getDoc, query, orderBy, limit as queryLimit, where } from 'firebase/firestore';
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

async function getDocuments<T>(collectionName: string, options?: { limit?: number }): Promise<T[]> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return [];
  }
  const colRef = collection(firestore, collectionName);
  const q = options?.limit 
    ? query(colRef, orderBy('createdAt', 'desc'), queryLimit(options.limit))
    : query(colRef, orderBy('createdAt', 'desc'));
  
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
