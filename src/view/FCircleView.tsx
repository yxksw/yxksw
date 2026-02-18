import { useState, useEffect, useCallback } from 'react';
import Animation from "../components/Animation";
import { RefreshCw } from "lucide-react";

// 配置选项
const UserConfig = {
  private_api_url: 'https://fc.050815.xyz/',
  page_turning_number: 20,
  error_img: "https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite@latest/static/favicon.ico"
};

interface Article {
  title: string;
  author: string;
  avatar: string;
  link: string;
  created: string;
}

interface Stats {
  friends_num: number;
  active_num: number;
  article_num: number;
  last_updated_time: string;
}

// 页面头部组件
function PageHeader({ background, title, desc }: { background: string; title: string; desc: string }) {
  return (
    <div className="page-banner mb-6">
      <div className="cover-wrapper rounded-2xl overflow-hidden h-[300px] relative">
        <img 
          src={background} 
          className="w-full h-full object-cover"
          alt="cover"
        />
      </div>
      <div className="header-wrapper mt-3 px-5 py-4 rounded-2xl bg-white border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <span className="text-slate-600 mt-1 block">{desc}</span>
      </div>
    </div>
  );
}

export default function FCircleView() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({
    friends_num: 0,
    active_num: 0,
    article_num: 0,
    last_updated_time: ''
  });
  const [start, setStart] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [randomArticle, setRandomArticle] = useState<Article | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [currentAuthorAvatar, setCurrentAuthorAvatar] = useState('');
  const [authorOrigin, setAuthorOrigin] = useState('');
  const [authorArticles, setAuthorArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return dateString ? dateString.substring(0, 10) : '';
  };

  // 头像加载处理
  const avatarOrDefault = (avatar: string) => {
    return avatar || UserConfig.error_img;
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = UserConfig.error_img;
  };

  // 初始化加载数据
  const initializeData = useCallback(async () => {
    const cacheKey = 'friend-circle-lite-cache';
    const cacheTimeKey = 'friend-circle-lite-cache-time';
    const now = new Date().getTime();

    try {
      // 检查缓存
      const cacheTime = localStorage.getItem(cacheTimeKey);
      if (cacheTime && (now - parseInt(cacheTime) < 10 * 60 * 1000)) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          processInitialData(data);
          return;
        }
      }

      // 从API获取数据
      const response = await fetch(`${UserConfig.private_api_url}all.json`);
      const data = await response.json();

      // 更新缓存
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());

      processInitialData(data);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }, []);

  // 处理初始数据
  const processInitialData = (data: any) => {
    // 更新统计数据
    setStats({
      friends_num: data.statistical_data.friends_num,
      active_num: data.statistical_data.active_num,
      article_num: data.statistical_data.article_num,
      last_updated_time: data.statistical_data.last_updated_time
    });

    // 保存所有文章
    const articles = data.article_data;
    setAllArticles(articles);

    // 只显示第一批文章
    const initialArticles = articles.slice(0, UserConfig.page_turning_number);
    setDisplayedArticles(initialArticles);
    setStart(UserConfig.page_turning_number);
    setHasMoreArticles(articles.length > UserConfig.page_turning_number);

    // 设置随机文章
    if (articles.length > 0) {
      const randomIndex = Math.floor(Math.random() * articles.length);
      setRandomArticle(articles[randomIndex]);
    }
  };

  // 手动加载更多文章
  const loadMoreArticles = () => {
    if (isLoading || !hasMoreArticles) return;
    
    setIsLoading(true);
    
    // 模拟加载延迟，提升用户体验
    setTimeout(() => {
      const nextArticles = allArticles.slice(
        start, 
        start + UserConfig.page_turning_number
      );
      
      setDisplayedArticles(prev => [...prev, ...nextArticles]);
      setStart(prev => prev + UserConfig.page_turning_number);
      setHasMoreArticles(start + UserConfig.page_turning_number < allArticles.length);
      setIsLoading(false);
    }, 300);
  };

  // 显示随机文章
  const displayRandomArticle = () => {
    if (allArticles.length > 0) {
      const randomIndex = Math.floor(Math.random() * allArticles.length);
      setRandomArticle(allArticles[randomIndex]);
    }
  };

  // 打开文章链接
  const openArticle = (link: string) => {
    window.open(link, '_blank');
  };

  // 打开随机文章
  const openRandomArticle = () => {
    if (randomArticle) {
      window.open(randomArticle.link, '_blank');
    }
  };

  // 显示作者文章模态框
  const showAuthorArticles = (author: string, avatar: string, link: string) => {
    setCurrentAuthor(author);
    setCurrentAuthorAvatar(avatar);
    setAuthorOrigin(new URL(link).origin);
    setAuthorArticles(allArticles
      .filter(article => article.author === author)
      .slice(0, 4)
    );
    setShowModal(true);
    document.body.classList.add('overflow-hidden');
  };

  // 隐藏模态框
  const hideModal = () => {
    setShowModal(false);
    document.body.classList.remove('overflow-hidden');
  };

  // 页面挂载时初始化
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <Animation id="fcircle">
      <div className="fcircle-page">
        <PageHeader 
          background="https://img.314926.xyz/h" 
          title="友链朋友圈" 
          desc="探索朋友们的最新动态" 
        />
        
        <div className="article-list mx-4">
          {/* 随机文章区域 */}
          {randomArticle && (
            <div className="random-article flex items-center gap-3 justify-between my-4">
              <div className="random-container-title text-lg font-bold whitespace-nowrap hidden sm:block">随机钓鱼</div>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); openRandomArticle(); }}
                className="article-item flex-1 min-w-0"
              >
                <div className="article-container gradient-card flex items-center gap-2 h-10 px-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition-all">
                  <div className="article-author text-slate-500 text-sm flex-shrink-0">{randomArticle.author}</div>
                  <div className="article-title text-slate-700 text-sm flex-1 truncate">{randomArticle.title}</div>
                  <div className="article-date text-slate-400 text-xs flex-shrink-0">{randomArticle.created}</div>
                </div>
              </a>
              <button 
                className="refresh-btn gradient-card flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all flex-shrink-0"
                onClick={displayRandomArticle}
              >
                <RefreshCw size={18} />
              </button>
            </div>
          )}

          {/* 统计信息 */}
          <div className="stats-bar flex gap-4 mb-6 px-4 py-3 bg-white rounded-xl border border-slate-200">
            <div className="stat-item flex-1 text-center">
              <div className="stat-value text-xl font-bold text-slate-800">{stats.friends_num}</div>
              <div className="stat-label text-xs text-slate-500">友链数</div>
            </div>
            <div className="stat-item flex-1 text-center">
              <div className="stat-value text-xl font-bold text-slate-800">{stats.active_num}</div>
              <div className="stat-label text-xs text-slate-500">活跃数</div>
            </div>
            <div className="stat-item flex-1 text-center">
              <div className="stat-value text-xl font-bold text-slate-800">{stats.article_num}</div>
              <div className="stat-label text-xs text-slate-500">文章数</div>
            </div>
            <div className="stat-item flex-1 text-center hidden sm:block">
              <div className="stat-value text-xs text-slate-600 mt-2">{stats.last_updated_time}</div>
              <div className="stat-label text-xs text-slate-500">更新时间</div>
            </div>
          </div>

          {/* 文章列表区域 */}
          <div className="articles-list flex flex-col gap-2">
            {displayedArticles.map((article, index) => (
              <div key={index} className="article-item flex items-center gap-3 w-full">
                <div 
                  className="article-image w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border border-slate-200"
                  onClick={() => showAuthorArticles(article.author, article.avatar, article.link)}
                >
                  <img 
                    src={avatarOrDefault(article.avatar)} 
                    onError={handleAvatarError}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all"
                    alt={article.author}
                  />
                </div>
                <div className="article-container gradient-card flex items-center gap-2 h-10 px-3 rounded-lg bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition-all flex-1 min-w-0">
                  <div className="article-author text-slate-500 text-sm flex-shrink-0">{article.author}</div>
                  <div 
                    className="article-title text-slate-700 text-sm flex-1 truncate hover:text-slate-900 transition-colors"
                    onClick={() => openArticle(article.link)}
                  >
                    {article.title}
                  </div>
                  <div className="article-date text-slate-400 text-xs font-mono flex-shrink-0">{formatDate(article.created)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 加载更多按钮 */}
          <div className="load-more-container text-center my-6">
            {hasMoreArticles && (
              <button 
                className="load-more gradient-card inline-block w-48 h-11 px-4 py-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={loadMoreArticles}
                disabled={isLoading}
              >
                {isLoading ? '加载中...' : '查看更多'}
              </button>
            )}
            {!hasMoreArticles && displayedArticles.length > 0 && (
              <div className="text-slate-400 text-sm">已经到底啦~</div>
            )}
          </div>
        </div>

        {/* 作者模态框 */}
        {showModal && (
          <div 
            id="modal"
            className="modal fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
            onClick={(e) => e.target === e.currentTarget && hideModal()}
          >
            <div className="modal-content bg-white/90 rounded-xl shadow-xl border border-slate-200 max-w-md w-[90%] max-h-[80vh] overflow-y-auto p-5 relative">
              <div className="modal-header flex items-center gap-4 border-b border-slate-200 pb-4 mb-5">
                <img 
                  src={avatarOrDefault(currentAuthorAvatar)} 
                  onError={handleAvatarError}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={currentAuthor}
                />
                <a 
                  href={authorOrigin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-700 font-medium hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-all"
                >
                  {currentAuthor}
                </a>
              </div>
              
              <div className="modal-articles">
                {authorArticles.map((article, index) => (
                  <div 
                    key={index} 
                    className="modal-article py-3 px-4 border-b border-slate-100 last:border-0"
                  >
                    <a 
                      className="modal-article-title text-slate-700 hover:text-slate-900 transition-colors block mb-1"
                      href={article.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                    <div className="modal-article-date text-slate-400 text-sm font-mono">📅 {formatDate(article.created)}</div>
                  </div>
                ))}
              </div>
              
              <img 
                src={avatarOrDefault(currentAuthorAvatar)} 
                onError={handleAvatarError}
                className="modal-bg absolute bottom-5 right-5 w-32 h-32 rounded-full opacity-40 blur-sm pointer-events-none"
                alt=""
              />
            </div>
          </div>
        )}
      </div>
    </Animation>
  );
}
