// =============================================================================
// Global Mirror HQ - Data Context
// =============================================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  NewsArticle,
  NewsCategory,
  NewsStatus,
  RssFeed,
  DashboardStats,
  ActivityLog
} from '@/types';

// -- Demo RSS Feeds ------------------------------------------------------------
const DEMO_RSS_FEEDS: RssFeed[] = [
  {
    id: '1',
    name: 'Google News - World',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'world',
    isActive: true,
    fetchInterval: 30,
  },
  {
    id: '2',
    name: 'Google News - Technology',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'technology',
    isActive: true,
    fetchInterval: 30,
  },
  {
    id: '3',
    name: 'Google News - Business',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'business',
    isActive: true,
    fetchInterval: 60,
  },
  {
    id: '4',
    name: 'Google News - Entertainment',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'entertainment',
    isActive: true,
    fetchInterval: 60,
  },
];

// -- Demo Articles -------------------------------------------------------------
const DEMO_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'SpaceX Successfully Launches New Satellite Constellation',
    description: "Elon Musk's SpaceX has successfully deployed 60 new Starlink satellites, expanding global internet coverage to remote regions.",
    url: 'https://example.com/spacex-launch',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
    source: 'TechCrunch',
    category: 'technology',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    fetchedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'ready',
    caption: '🚀 SpaceX just launched 60 new Starlink satellites! #SpaceX #Starlink #Technology',
    imagePrompt: 'A dramatic SpaceX Falcon 9 rocket launch at night with bright orange flames against a dark blue sky',
    hashtags: ['SpaceX', 'Starlink', 'Space', 'Technology'],
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'World leaders have agreed on ambitious new targets to reduce carbon emissions by 50% by 2030.',
    url: 'https://example.com/climate-summit',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
    source: 'BBC News',
    category: 'world',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    fetchedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'ready',
    caption: '🌍 BREAKING: Historic climate agreement! 50% emission reduction by 2030. #ClimateAction',
    imagePrompt: 'World leaders shaking hands on a green stage with Earth globe in background',
    hashtags: ['ClimateAction', 'COP28', 'Sustainability'],
  },
  {
    id: '3',
    title: 'Apple Unveils Revolutionary AI Features for iPhone',
    description: "Apple's latest iOS update brings on-device AI capabilities that promise to transform how we use smartphones.",
    url: 'https://example.com/apple-ai',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
    source: 'The Verge',
    category: 'technology',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    fetchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'processing',
  },
  {
    id: '4',
    title: 'New Study Reveals Health Benefits of Mediterranean Diet',
    description: 'Researchers find that following a Mediterranean diet can reduce heart disease risk by up to 30%.',
    url: 'https://example.com/mediterranean-diet',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    source: 'Health News',
    category: 'health',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    fetchedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    status: 'fetched',
  },
  {
    id: '5',
    title: 'Stock Markets Hit Record Highs Amid Economic Recovery',
    description: 'Major indices reach all-time highs as investors show confidence in global economic growth.',
    url: 'https://example.com/stock-market',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800',
    source: 'Reuters',
    category: 'business',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    fetchedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    status: 'posted',
    caption: '📈 Stock markets soaring! Record highs across major indices. #StockMarket #Economy',
    imagePrompt: 'A glowing stock market chart showing upward trend with green candlesticks',
    hashtags: ['StockMarket', 'Economy', 'Investing'],
    instagramUrl: 'https://instagram.com/p/example1',
  },
];

// -- Demo Logs -----------------------------------------------------------------
const DEMO_LOGS: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'admin',
    action: 'Generated Caption',
    details: 'Created Instagram caption for "SpaceX Successfully Launches..."',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    userName: 'editor',
    action: 'Posted to Instagram',
    details: 'Published article "Stock Markets Hit Record Highs..."',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// -- Context Interface ---------------------------------------------------------
interface DataContextType {
  articles: NewsArticle[];
  getArticlesByStatus: (status: NewsStatus) => NewsArticle[];
  getArticlesByCategory: (category: NewsCategory) => NewsArticle[];
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  generateCaption: (articleId: string) => Promise<string>;
  generateImagePrompt: (articleId: string) => Promise<string>;
  markAsPosted: (articleId: string, platformUrls: Partial<NewsArticle>) => void;
  rssFeeds: RssFeed[];
  toggleFeed: (id: string) => void;
  addFeed: (feed: Omit<RssFeed, 'id'>) => void;
  removeFeed: (id: string) => void;
  fetchRssNow: () => Promise<void>;
  stats: DashboardStats;
  activityLogs: ActivityLog[];
  addActivityLog: (action: string, details: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// -- Provider ------------------------------------------------------------------
export function DataProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>(DEMO_ARTICLES);
  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>(DEMO_RSS_FEEDS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(DEMO_LOGS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const res = await fetch("https://global-mirror-hq.onrender.com/api/rss/fetch");
        if (!res.ok) return;
        const data: NewsArticle[] = await res.json();
        if (data && data.length) {
          setArticles(prev => [...data, ...prev]);
          console.log("🔥 Trending News Updated:", data.length, "articles");
        }
      } catch (err) {
        console.log("RSS fetch error:", err);
      }
    };

    fetchTrendingNews();
    const interval = setInterval(fetchTrendingNews, 600000);
    return () => clearInterval(interval);
  }, []);

  // -- Stats -----------------------------------------------------------------
  const stats: DashboardStats = {
    totalArticles: articles.length,
    readyToPost: articles.filter(a => a.status === 'ready').length,
    postedToday: articles.filter(a => {
      if (a.status !== 'posted') return false;
      const postedDate = (a as any).updatedAt ? new Date((a as any).updatedAt) : null;
      if (!postedDate) return false;
      return postedDate.toDateString() === new Date().toDateString();
    }).length,
    pendingProcessing: articles.filter(a => a.status === 'fetched' || a.status === 'processing').length,
    sourcesActive: rssFeeds.filter(f => f.isActive).length,
  };

  // -- Article methods -------------------------------------------------------
  const getArticlesByStatus = (status: NewsStatus) =>
    articles.filter(a => a.status === status);

  const getArticlesByCategory = (category: NewsCategory) =>
    articles.filter(a => a.category === category);

  const updateArticle = (id: string, updates: Partial<NewsArticle>) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } as NewsArticle : a
    ));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const generateCaption = async (articleId: string): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const article = articles.find(a => a.id === articleId);
    if (!article) { setIsLoading(false); throw new Error('Article not found'); }

    const captions: Record<string, string> = {
      world:         `🌍 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nWhat are your thoughts? 👇 #WorldNews #Global #BreakingNews`,
      technology:    `🚀 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nThe future is now! 💡 #Tech #Innovation #Technology`,
      business:      `📈 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nMarkets are moving! 💼 #Business #Finance`,
      entertainment: `🎬 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nCan't wait! 🍿 #Entertainment`,
      sports:        `⚽ ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nGame on! 🏆 #Sports`,
      science:       `🔬 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nScience never stops! 🧪 #Science`,
      health:        `💪 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nYour health matters! 🏥 #Health`,
      tech:          `🚀 ${article.title}\n\n${article.description?.slice(0, 100)}...\n\nThe future is now! 💡 #Tech #Innovation`,
    };

    const caption = captions[article.category] ?? captions['world'];
    updateArticle(articleId, { caption, status: article.imagePrompt ? 'ready' : 'processing' });
    setIsLoading(false);
    return caption;
  };

  const generateImagePrompt = async (articleId: string): Promise<string> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const article = articles.find(a => a.id === articleId);
    if (!article) { setIsLoading(false); throw new Error('Article not found'); }

    const prompt = `Professional news-style illustration for: "${article.title}". ${article.category} theme, modern editorial style, high quality, suitable for social media.`;
    updateArticle(articleId, { imagePrompt: prompt, status: article.caption ? 'ready' : 'processing' });
    setIsLoading(false);
    return prompt;
  };

  const markAsPosted = (articleId: string, platformUrls: Partial<NewsArticle>) => {
    updateArticle(articleId, { status: 'posted', ...platformUrls });
  };

  // -- RSS methods -----------------------------------------------------------
  const toggleFeed = (id: string) => {
    setRssFeeds(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  const addFeed = (feed: Omit<RssFeed, 'id'>) => {
    setRssFeeds(prev => [...prev, { ...feed, id: Date.now().toString() }]);
  };

  const removeFeed = (id: string) => {
    setRssFeeds(prev => prev.filter(f => f.id !== id));
  };

  const fetchRssNow = async () => {
  setIsLoading(true);
  try {
    const res = await fetch("https://global-mirror-hq.onrender.com/api/rss/fetch");
    if (!res.ok) throw new Error('Server error');
    const data: NewsArticle[] = await res.json();
    if (data && data.length) {
      // har baar fresh articles force add karo — ID timestamp based hain to unique honge
      setArticles(prev => [...data, ...prev]);
    }
  } catch (err) {
    console.log("fetchRssNow error:", err);
  } finally {
    setIsLoading(false);
  }
};
  // -- Activity Log ----------------------------------------------------------
  const addActivityLog = (action: string, details: string) => {
    const user = JSON.parse(localStorage.getItem('gmhq_user') || '{}');
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user.id || 'unknown',
      userName: user.username || 'unknown',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  return (
    <DataContext.Provider
      value={{
        articles,
        getArticlesByStatus,
        getArticlesByCategory,
        updateArticle,
        deleteArticle,
        generateCaption,
        generateImagePrompt,
        markAsPosted,
        rssFeeds,
        toggleFeed,
        addFeed,
        removeFeed,
        fetchRssNow,
        stats,
        activityLogs,
        addActivityLog,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// -- Hook ----------------------------------------------------------------------
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
