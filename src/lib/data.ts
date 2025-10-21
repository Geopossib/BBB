import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/firebase/init'; // A simple firestore instance
import type { Timestamp } from 'firebase/firestore';

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
  youtubeUrl: string;
  thumbnailId: string;
  category: string;
  duration: string;
  createdAt: Timestamp;
};

export type AudioFile = {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  category: string;
  duration: string;
  createdAt: Timestamp;
};

export async function getArticles(options?: { limit?: number }): Promise<Article[]> {
  const articlesCol = collection(firestore, 'articles');
  const q = options?.limit 
    ? query(articlesCol, orderBy('createdAt', 'desc'), limit(options.limit))
    : query(articlesCol, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Article;
  });
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    // In a real app, you'd query by slug. Firestore doesn't support this efficiently without complex setups.
    // For now, we'll fetch all and filter. This is NOT scalable.
    const allArticles = await getArticles();
    const article = allArticles.find(a => a.slug === slug);
    if (!article) return undefined;
    
    // Let's assume we can get the single doc for more accurate data.
    const docRef = doc(firestore, 'articles', article.id);
    const docSnap = await getDoc(docRef);
     if (!docSnap.exists()) return undefined;

    const data = docSnap.data();
     return {
        id: docSnap.id,
        ...data,
        date: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
     } as Article
}

export async function getVideos(options?: { limit?: number }): Promise<Video[]> {
  const videosCol = collection(firestore, 'videos');
  const q = options?.limit
    ? query(videosCol, orderBy('createdAt', 'desc'), limit(options.limit))
    : query(videosCol, orderBy('createdAt', 'desc'));
    
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const docRef = doc(firestore, 'videos', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Video : undefined;
}

export async function getAudioFiles(options?: { limit?: number }): Promise<AudioFile[]> {
    const audioCol = collection(firestore, 'audios');
    const q = options?.limit
        ? query(audioCol, orderBy('createdAt', 'desc'), limit(options.limit))
        : query(audioCol, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AudioFile));
}

export async function getAudioById(id: string): Promise<AudioFile | undefined> {
  const docRef = doc(firestore, 'audios', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as AudioFile : undefined;
}
