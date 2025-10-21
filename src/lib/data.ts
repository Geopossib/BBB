// Mock data for BSN Connect

export type Article = {
  id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  imageId: string;
  excerpt: string;
  content: string;
  category: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailId: string;
  category: string;
  duration: string;
};

export type AudioFile = {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  category: string;
  duration: string;
};

const articles: Article[] = [
  {
    id: '1',
    title: 'The Power of Forgiveness',
    slug: 'the-power-of-forgiveness',
    author: 'Pastor John Doe',
    date: '2024-05-15',
    imageId: 'article-image-1',
    category: 'Christian Living',
    excerpt: 'Discover the liberating power of forgiveness and how it can transform your relationships and your life.',
    content: `<p>In a world often filled with conflict and hurt, the concept of forgiveness stands as a cornerstone of Christian faith. But what does it truly mean to forgive? It's more than just uttering the words "I forgive you." It is a profound, often difficult, decision to let go of resentment and the desire for retribution.</p><p>The Bible is replete with teachings on forgiveness. In Matthew 6:14-15, Jesus tells us, "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins." This powerful statement links our own forgiveness from God directly to our willingness to forgive others.</p><p>Practicing forgiveness is not about condoning the wrong that was done. It is about freeing yourself from the bitterness that can consume your heart. It is an act of faith, trusting that God is the ultimate judge and that His justice will prevail. When we choose to forgive, we are choosing to walk in freedom and to reflect the grace that has been so lavishly extended to us.</p>`,
  },
  {
    id: '2',
    title: 'Finding Joy in the Everyday',
    slug: 'finding-joy-in-the-everyday',
    author: 'Jane Smith',
    date: '2024-05-10',
    imageId: 'article-image-4',
    category: 'Faith & Work',
    excerpt: 'Joy is not just for the mountain-top experiences. Learn how to cultivate a spirit of joy in your daily life.',
    content: `<p>Joy is often mistaken for happiness, a fleeting emotion dependent on circumstances. However, biblical joy is a deep, abiding sense of well-being and contentment that comes from knowing God, regardless of our situation. As Nehemiah 8:10 says, "The joy of the Lord is your strength."</p><p>How can we cultivate this joy? It begins with gratitude. By consciously thanking God for the small, everyday blessings, we shift our focus from what we lack to the abundance we already possess. A morning cup of coffee, the warmth of the sun, a conversation with a friend – these are all gifts from God.</p><p>Another key is to serve others. When we take the focus off ourselves and look for ways to bless those around us, we tap into a source of joy that is both profound and lasting. True joy is found not in receiving, but in giving.</p>`,
  },
  {
    id: '3',
    title: 'The Importance of Community',
    slug: 'the-importance-of-community',
    author: 'Pastor John Doe',
    date: '2024-05-01',
    imageId: 'article-image-2',
    category: 'Church Life',
    excerpt: 'We were not meant to walk the path of faith alone. Explore the biblical basis for Christian community.',
    content: `<p>From the very beginning, God established humanity in relationship. "It is not good for the man to be alone," (Genesis 2:18). This principle extends throughout Scripture, emphasizing the need for community. The early church, as described in Acts 2, was a vibrant community of believers who devoted themselves to the apostles' teaching, to fellowship, to the breaking of bread, and to prayer.</p><p>Christian community, or 'koinonia,' provides support, accountability, and encouragement. It's in the context of community that we can "carry each other’s burdens, and in this way you will fulfill the law of Christ" (Galatians 6:2). It is a safe place to be vulnerable, to share our struggles, and to celebrate our victories together.</p>`,
  },
];

const videos: Video[] = [
  {
    id: '1',
    title: 'Sermon: A Faith That Moves Mountains',
    description: 'Join us for a powerful sermon on the nature of true, mountain-moving faith and how to cultivate it in your life.',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder URL
    thumbnailId: 'video-thumb-1',
    category: 'Sermons',
    duration: '45:12',
  },
  {
    id: '2',
    title: 'Panel: Faith in the Modern World',
    description: 'A thoughtful discussion on the challenges and opportunities for Christians in the 21st century.',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailId: 'video-thumb-2',
    category: 'Discussions',
    duration: '1:02:30',
  },
  {
    id: '3',
    title: 'Worship Session: Hymns of Hope',
    description: 'A beautiful and uplifting worship session featuring classic hymns that speak of God\'s enduring hope.',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailId: 'video-thumb-3',
    category: 'Worship',
    duration: '30:55',
  },
];

const audioFiles: AudioFile[] = [
  {
    id: '1',
    title: 'Daily Devotional: Psalm 23',
    description: 'A short devotional exploring the depths of Psalm 23 and the comfort of the Good Shepherd.',
    audioUrl: '/audio/placeholder-audio.mp3', // Placeholder, needs actual file
    category: 'Devotionals',
    duration: '15:20',
  },
  {
    id: '2',
    title: 'Teaching: The Fruits of the Spirit',
    description: 'An in-depth study of Galatians 5 and what it means to live a life characterized by the fruits of the Spirit.',
    audioUrl: '/audio/placeholder-audio.mp3',
    category: 'Teachings',
    duration: '55:05',
  },
  {
    id: '3',
    title: 'Prayer and Meditation',
    description: 'A guided time of prayer and meditation to help you connect with God and find peace in His presence.',
    audioUrl: '/audio/placeholder-audio.mp3',
    category: 'Prayer',
    duration: '25:00',
  },
];

export function getArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getVideos(): Video[] {
  return videos;
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((video) => video.id === id);
}

export function getAudioFiles(): AudioFile[] {
  return audioFiles;
}

export function getAudioById(id: string): AudioFile | undefined {
  return audioFiles.find((audio) => audio.id === id);
}
