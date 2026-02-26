// =============================================================================
// Global Mirror HQ - Main Dashboard
// =============================================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Rss,
  Settings,
  LogOut,
  Plus,
  RefreshCw,
  Image,
  Sparkles,
  Clock,
  CheckCircle,
  Globe,
  Menu,
  ChevronRight,
  Zap,
  Users,
  Database,
  Copy,
  Check,
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import type { NewsArticle } from '@/types';

// -- StatCard ------------------------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  );
}

// -- NewsCard ------------------------------------------------------------------

function NewsCard({ article }: { article: NewsArticle }) {
  const { } = useData();
  const [localImage, setLocalImage] = useState<string>(article.imageUrl || '');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeCaption, setActiveCaption] = useState<'instagram' | 'facebook' | 'youtube' | null>(null);
  const [platformCaption, setPlatformCaption] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const platformConfig = {
    instagram: {
      name: 'Instagram',
      wordLimit: 150,
      color: 'from-pink-500 to-purple-600',
      border: 'border-pink-500/30',
      textColor: 'text-pink-400',
      bg: 'bg-pink-500/10',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    facebook: {
      name: 'Facebook',
      wordLimit: 300,
      color: 'from-blue-600 to-blue-700',
      border: 'border-blue-500/30',
      textColor: 'text-blue-400',
      bg: 'bg-blue-500/10',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    youtube: {
      name: 'YT Shorts',
      wordLimit: 80,
      color: 'from-red-600 to-red-700',
      border: 'border-red-500/30',
      textColor: 'text-red-400',
      bg: 'bg-red-500/10',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  };

  // AI Image generate
  const handleGenerateAIImage = async () => {
    setGeneratingImage(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: article.title, category: article.category }),
      });
      const data = await res.json();
      if (data.imageUrl) setLocalImage(data.imageUrl);
    } catch (err) {
      console.log("Image error:", err);
    } finally {
      setGeneratingImage(false);
    }
  };

  // Gemini AI Caption
  const handlePlatformClick = async (platform: 'instagram' | 'facebook' | 'youtube') => {
    if (activeCaption === platform) {
      setActiveCaption(null);
      return;
    }
    setActiveCaption(platform);
    setGeneratingCaption(true);
    setPlatformCaption('');

    try {
      const res = await fetch(`http://localhost:5000/api/caption/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
        }),
      });
      const data = await res.json();
      setPlatformCaption(data.caption || '');
    } catch (err) {
      // Fallback
      const desc = article.description?.slice(0, 200) || '';
      const fallbacks: Record<string, string> = {
        instagram: `📸 ${article.title}\n\n${desc}\n\n#News #Trending #GlobalMirror #BreakingNews`,
        facebook:  `🌍 ${article.title}\n\n${desc}\n\nStay updated with Global Mirror!\n\n#GlobalMirror #News`,
        youtube:   `🔥 ${article.title}\n\n${desc.slice(0, 100)}\n\n#Shorts #News #Trending`,
      };
      setPlatformCaption(fallbacks[platform]);
    } finally {
      setGeneratingCaption(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOpenAndPost = (platform: 'instagram' | 'facebook' | 'youtube') => {
    // Caption copy
    navigator.clipboard.writeText(platformCaption).catch(() => {
      const el = document.createElement('textarea');
      el.value = platformCaption;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });

    // Image download
    if (localImage) {
      const a = document.createElement('a');
      a.href = localImage;
      a.download = 'news-image.jpg';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Platform open
    const urls: Record<string, string> = {
      instagram: 'https://www.instagram.com/',
      facebook:  'https://www.facebook.com/',
      youtube:   'https://studio.youtube.com/',
    };
    setTimeout(() => {
      const win = window.open(urls[platform], '_blank');
      if (!win) window.location.href = urls[platform];
    }, 300);

    setCopied('open');
    setTimeout(() => setCopied(null), 3000);
  };

  const activePlatform = activeCaption ? platformConfig[activeCaption] : null;
  const wordCount = platformCaption.split(' ').filter(Boolean).length;

  return (
    <div className="bg-[#0A0A0F] border border-white/5 rounded-2xl overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-white/5 group">
        <img
          src={localImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            article.status === 'ready'      ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            article.status === 'posted'     ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            article.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            {article.status}
          </span>
        </div>

        {/* Bottom buttons - hover pe dikhe */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleGenerateAIImage}
            disabled={generatingImage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg border border-white/20 hover:bg-black/90 transition-all disabled:opacity-50"
          >
            {generatingImage
              ? <RefreshCw size={11} className="animate-spin" />
              : <Sparkles size={11} className="text-[#00D4FF]" />
            }
            {generatingImage ? 'Loading...' : 'AI Image'}
          </button>
          <label className="flex items-center gap-1 px-3 py-1.5 bg-black/70 text-white text-xs rounded-lg border border-white/20 hover:bg-black/90 transition-all cursor-pointer">
            <Image size={11} />
            Upload
            <input type="file" accept="image/*" hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLocalImage(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="text-[#00D4FF] font-medium">{article.source}</span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>

        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {article.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2">{article.description}</p>

        {/* Platform Buttons */}
        <div className="border-t border-white/5 pt-3">
          <div className="text-xs text-gray-500 mb-2">🤖 Gemini AI Caption + Post:</div>
          <div className="grid grid-cols-3 gap-2">
            {(['instagram', 'facebook', 'youtube'] as const).map(platform => {
              const cfg = platformConfig[platform];
              const isActive = activeCaption === platform;
              return (
                <button
                  key={platform}
                  onClick={() => handlePlatformClick(platform)}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                    isActive
                      ? `bg-gradient-to-br ${cfg.color} text-white border-transparent shadow-lg`
                      : `${cfg.bg} ${cfg.textColor} ${cfg.border} hover:opacity-80`
                  }`}
                >
                  {cfg.icon}
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Caption Box */}
        {activeCaption && activePlatform && (
          <div className={`rounded-xl border p-3 flex flex-col gap-2 ${activePlatform.bg} ${activePlatform.border}`}>

            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${activePlatform.textColor}`}>
                {activePlatform.icon}
                {activePlatform.name} — AI Generated
              </div>
              <span className={`text-xs ${wordCount > activePlatform.wordLimit ? 'text-red-400' : 'text-gray-500'}`}>
                {wordCount}/{activePlatform.wordLimit} words
              </span>
            </div>

            {generatingCaption ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-4 justify-center">
                <RefreshCw size={12} className="animate-spin" />
                Gemini AI generating...
              </div>
            ) : (
              <textarea
                value={platformCaption}
                onChange={e => setPlatformCaption(e.target.value)}
                className="w-full bg-black/30 text-gray-200 text-xs rounded-lg p-2.5 resize-none border border-white/5 focus:outline-none focus:border-white/20 leading-relaxed"
                rows={5}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(platformCaption, activeCaption)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border transition-all ${activePlatform.bg} ${activePlatform.textColor} ${activePlatform.border}`}
              >
                {copied === activeCaption
                  ? <><Check size={11} /> Copied!</>
                  : <><Copy size={11} /> Copy</>
                }
              </button>
              <button
                onClick={() => handleOpenAndPost(activeCaption)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg text-white font-medium bg-gradient-to-r ${activePlatform.color} hover:opacity-90 transition-all`}
              >
                {copied === 'open'
                  ? <><Check size={11} /> Opening...</>
                  : <>{activePlatform.icon} Post Now</>
                }
              </button>
            </div>

            {copied === 'open' && (
              <div className="text-xs text-center text-green-400 bg-green-500/10 rounded-lg py-1.5 border border-green-500/20">
                ✅ Caption copied + Image downloading — Bas paste karo!
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

// -- Sidebar -------------------------------------------------------------------

function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'news',      label: 'Latest News',   icon: Newspaper },
    { id: 'ready',     label: 'Ready to Post', icon: CheckCircle },
    { id: 'rss',       label: 'RSS Feeds',     icon: Rss },
    ...(hasPermission('admin') ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0A0F1E] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00D4FF] to-[#4D9FFF] rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Global Mirror</div>
              <div className="text-[#00D4FF] text-xs font-medium">HQ</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#00D4FF]/20 to-[#4D9FFF]/20 text-[#00D4FF] border border-[#00D4FF]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={16} />
              {item.label}
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00D4FF] to-[#4D9FFF] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.username}</div>
              <div className="text-gray-500 text-xs capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl text-sm transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

// -- Dashboard -----------------------------------------------------------------

export default function Dashboard() {
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log("AI Backend:", data))
      .catch(err => console.log("Backend error:", err));
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { stats, articles, getArticlesByStatus, fetchRssNow, isLoading } = useData();

  const renderContent = () => {
    switch (activeTab) {

      case 'dashboard':
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Database}    label="Total Articles" value={stats?.totalArticles     ?? 0} color="bg-[#00D4FF]/20 text-[#00D4FF]"  trend="+12%" />
              <StatCard icon={Clock}       label="Processing"     value={stats?.pendingProcessing ?? 0} color="bg-yellow-500/20 text-yellow-400" />
              <StatCard icon={CheckCircle} label="Ready to Post"  value={stats?.readyToPost       ?? 0} color="bg-green-500/20 text-green-400"  />
              <StatCard icon={Zap}         label="Posted Today"   value={stats?.postedToday       ?? 0} color="bg-purple-500/20 text-purple-400" trend="+5%" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => fetchRssNow()}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#00D4FF]/20 to-[#4D9FFF]/20 border border-[#00D4FF]/30 text-[#00D4FF] rounded-xl hover:from-[#00D4FF]/30 hover:to-[#4D9FFF]/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  Fetch RSS Now
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  <Plus size={16} />
                  View News
                </button>
              </div>
            </div>

            {getArticlesByStatus('ready').length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Ready to Post</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getArticlesByStatus('ready').slice(0, 3).map(article => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-3">
                {[
                  { action: 'Generated Caption',  detail: 'SpaceX Successfully Launches...',   time: '30 min ago',  user: 'admin'  },
                  { action: 'Posted to Instagram', detail: 'Stock Markets Hit Record Highs...', time: '2 hours ago', user: 'editor' },
                  { action: 'RSS Feed Updated',    detail: '12 new articles fetched',           time: '3 hours ago', user: 'system' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-[#00D4FF] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{activity.action}</div>
                      <div className="text-gray-500 text-xs truncate">{activity.detail}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gray-400 text-xs">{activity.time}</div>
                      <div className="text-[#00D4FF] text-xs">{activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-white text-xl font-bold">Latest News</h1>
              <div className="flex flex-wrap gap-2">
                {(['all', 'fetched', 'processing', 'ready', 'posted'] as const).map(status => (
                  <button
                    key={status}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all capitalize"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {articles.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        );

      case 'ready':
        return (
          <div className="flex flex-col gap-5">
            <h1 className="text-white text-xl font-bold">Ready to Post</h1>
            {getArticlesByStatus('ready').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <CheckCircle size={40} className="text-gray-600" />
                <div className="text-white font-medium">No articles ready to post yet</div>
                <div className="text-gray-500 text-sm">Click platform buttons on news cards to generate captions</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {getArticlesByStatus('ready').map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        );

      case 'rss':      return <RssFeedsPanel />;
      case 'settings': return <SettingsPanel />;
      default:         return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-[#060B18]/80 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <div className="text-white font-semibold capitalize">{activeTab}</div>
            <div className="text-gray-500 text-xs">Welcome back, {user?.username}</div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// -- RSS Feeds Panel -----------------------------------------------------------

function RssFeedsPanel() {
  const { rssFeeds, toggleFeed, fetchRssNow, isLoading } = useData();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">RSS Feed Sources</h1>
        <button
          onClick={() => fetchRssNow()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00D4FF]/20 to-[#4D9FFF]/20 border border-[#00D4FF]/30 text-[#00D4FF] rounded-xl hover:from-[#00D4FF]/30 hover:to-[#4D9FFF]/30 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Fetch All Now
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {rssFeeds.map(feed => (
          <div key={feed.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-xl flex items-center justify-center text-[#00D4FF]">
              <Rss size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{feed.name}</div>
              <div className="text-gray-500 text-xs truncate">{feed.url.slice(0, 60)}...</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{feed.category}</span>
                <span className="text-xs text-gray-600">Every {feed.fetchInterval} min</span>
              </div>
            </div>
            <button
              onClick={() => toggleFeed(feed.id)}
              className={`relative w-14 h-8 rounded-full transition-all ${feed.isActive ? 'bg-[#00D4FF]' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${feed.isActive ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center gap-2 text-center">
        <Plus size={24} className="text-gray-600" />
        <div className="text-white text-sm font-medium">Add new RSS feed source</div>
        <div className="text-gray-500 text-xs">Support for Google News, RSS feeds, and more</div>
      </div>
    </div>
  );
}

// -- Settings Panel ------------------------------------------------------------

function SettingsPanel() {
  const { user } = useAuth();
  const [autoCaption, setAutoCaption] = useState(true);
  const [autoImage, setAutoImage]     = useState(false);

  const updateSettings = (newSettings: Record<string, unknown>) => {
    fetch("http://localhost:5000/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <h1 className="text-white text-xl font-bold">Settings</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Sparkles size={16} className="text-[#00D4FF]" />
          AI Generation Settings
        </h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-sm font-medium">Auto-generate captions</div>
            <div className="text-gray-500 text-xs">Automatically create captions for new articles</div>
          </div>
          <button
            onClick={() => { setAutoCaption(!autoCaption); updateSettings({ autoCaption: !autoCaption }); }}
            className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${autoCaption ? 'bg-[#00D4FF]' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoCaption ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white text-sm font-medium">Auto-generate image prompts</div>
            <div className="text-gray-500 text-xs">Automatically create AI image prompts</div>
          </div>
          <button
            onClick={() => { setAutoImage(!autoImage); updateSettings({ autoImagePrompt: !autoImage }); }}
            className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${autoImage ? 'bg-[#00D4FF]' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoImage ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Rss size={16} className="text-[#00D4FF]" />
          RSS Fetch Settings
        </h2>
        <div>
          <label className="text-white text-sm font-medium block mb-2">Fetch Interval</label>
          <select className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00D4FF]/50">
            <option value="15">Every 15 minutes</option>
            <option value="30">Every 30 minutes</option>
            <option value="60">Every 1 hour</option>
            <option value="120">Every 2 hours</option>
          </select>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Users size={16} className="text-[#00D4FF]" />
          Account Information
        </h2>
        {[
          { label: 'Username', value: user?.username },
          { label: 'Email',    value: user?.email },
          { label: 'Role',     value: user?.role },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className="text-white text-sm font-medium capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
