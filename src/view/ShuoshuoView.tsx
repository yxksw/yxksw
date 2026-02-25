import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Animation from "../components/Animation";
import { MessageCircle, RefreshCw, Loader2 } from "lucide-react";

// 数据接口
interface ChannelMessage {
  text: string;
  image: string[];
  time: number;
  views: string | null;
}

interface ApiResponse {
  nextBefore: number;
  Region: string;
  version: string;
  ChannelMessageData: Record<string, ChannelMessage>;
}

interface ReactionItem {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface MessageReactions {
  [messageId: string]: ReactionItem[];
}

// Fancybox 类型声明
declare global {
  interface Window {
    Fancybox: any;
  }
}

// 全局弹窗状态管理
let globalOpenPicker: ((messageId: string | null, rect: DOMRect | null) => void) | null = null;

// 表情选择器弹窗组件
function GlobalEmojiPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  
  const availableEmojis = ['👍', '❤️', '😄', '🎉', '🤔', '👏', '🔥', '👀'];
  
  useEffect(() => {
    globalOpenPicker = (messageId, rect) => {
      if (messageId && rect) {
        setCurrentMessageId(messageId);
        const popupWidth = 180;
        const popupHeight = 60;
        const top = rect.top - popupHeight - 8;
        const left = rect.left + rect.width / 2 - popupWidth / 2;
        setPosition({ top, left });
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setCurrentMessageId(null);
      }
    };
    
    return () => {
      globalOpenPicker = null;
    };
  }, []);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.global-emoji-picker') && !target.closest('.emoji-trigger-btn')) {
        setIsOpen(false);
        setCurrentMessageId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const handleSelect = (emoji: string) => {
    if (currentMessageId) {
      window.dispatchEvent(new CustomEvent('emoji-select', { 
        detail: { messageId: currentMessageId, emoji } 
      }));
    }
    setIsOpen(false);
    setCurrentMessageId(null);
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <div 
      className="global-emoji-picker fixed z-[99999]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="emoji-picker-popup rounded-xl shadow-2xl border p-2">
        <div className="flex gap-1">
          {availableEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSelect(emoji)}
              className="w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div 
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
        style={{
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid var(--bg-card)',
        }}
      />
      <style>{`
        .emoji-picker-popup {
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .emoji-picker-popup button:hover {
          background: var(--border-color);
        }
      `}</style>
    </div>,
    document.body
  );
}

// 表情反应组件
function EmojiReaction({ 
  messageId, 
  reactions,
  onReact
}: { 
  messageId: string;
  reactions: ReactionItem[];
  onReact: (messageId: string, emoji: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const allReactionsRef = useRef<HTMLDivElement>(null);
  
  const handleTriggerClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (globalOpenPicker) {
        globalOpenPicker(messageId, rect);
      }
    }
  };
  
  const handleReact = (emoji: string) => {
    onReact(messageId, emoji);
  };
  
  useEffect(() => {
    if (!showAllReactions) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (allReactionsRef.current && !allReactionsRef.current.contains(e.target as Node)) {
        setShowAllReactions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAllReactions]);
  
  const displayReactions = reactions.slice(0, 3);
  const hasMore = reactions.length > 3;
  const hiddenReactions = reactions.slice(3);
  
  return (
    <div className="flex items-center gap-1 relative">
      <div className="flex items-center gap-1">
        {displayReactions.map((reaction, idx) => (
          <button
            key={idx}
            onClick={() => handleReact(reaction.emoji)}
            className={`emoji-reaction flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all border flex-shrink-0 ${
              reaction.reacted 
                ? 'reacted' 
                : ''
            }`}
          >
            <span>{reaction.emoji}</span>
            <span className="font-medium">{reaction.count}</span>
          </button>
        ))}
        {hasMore && (
          <button
            onClick={() => setShowAllReactions(!showAllReactions)}
            className="emoji-more text-xs flex-shrink-0 px-1 py-0.5 rounded transition-colors"
          >
            +{reactions.length - 3}
          </button>
        )}
      </div>
      
      {showAllReactions && hasMore && (
        <div 
          ref={allReactionsRef}
          className="emoji-popup absolute bottom-full right-0 mb-2 p-2 rounded-xl shadow-xl border z-50"
        >
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {hiddenReactions.map((reaction, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleReact(reaction.emoji);
                  setShowAllReactions(false);
                }}
                className={`emoji-reaction flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border ${
                  reaction.reacted 
                    ? 'reacted' 
                    : ''
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        ref={buttonRef}
        onClick={handleTriggerClick}
        className="emoji-trigger-btn w-6 h-6 flex items-center justify-center rounded-full transition-all border flex-shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </button>
      
      <style>{`
        .emoji-reaction {
          background: var(--border-color);
          color: var(--text-secondary);
          border-color: var(--border-color);
        }
        .emoji-reaction:hover {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }
        .emoji-reaction.reacted {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.3);
        }
        .emoji-more {
          color: var(--text-muted);
          background: var(--border-color);
        }
        .emoji-more:hover {
          color: var(--text-primary);
          background: var(--accent-color);
          color: white;
        }
        .emoji-popup {
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .emoji-trigger-btn {
          background: var(--border-color);
          color: var(--text-muted);
          border-color: var(--border-color);
        }
        .emoji-trigger-btn:hover {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }
      `}</style>
    </div>
  );
}

// 单条说说卡片
function ShuoshuoCard({ 
  id, 
  message, 
  reactions,
  onReact,
  galleryId
}: { 
  id: string;
  message: ChannelMessage;
  reactions: ReactionItem[];
  onReact: (messageId: string, emoji: string) => void;
  galleryId: string;
}) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const processText = (text: string) => {
    let processed = text.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:text-amber-500 transition-colors">$1</a>'
    );
    processed = processed.replace(/\n/g, '<br>');
    return processed;
  };
  
  return (
    <div className="break-inside-avoid mb-3">
      <div className="shuoshuo-card rounded-xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5">
        {/* 头部信息 */}
        <div className="shuoshuo-header flex items-center pb-3 mb-3 border-b border-dashed">
          <img 
            src="https://cn.cravatar.com/avatar/eb7277a11fa4dc00606e73afda41aeeb?s=256"
            alt="异飨客"
            className="w-14 h-14 rounded-xl shadow-md object-cover"
          />
          <div className="flex flex-col ml-3">
            <span className="shuoshuo-name font-semibold text-lg">
              异飨客
              <svg className="inline-block w-4 h-4 ml-1 align-middle" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"/>
              </svg>
            </span>
            <span className="shuoshuo-time text-sm">{formatDate(message.time)}</span>
          </div>
        </div>
        
        {/* 文本内容 */}
        <div 
          className="shuoshuo-text leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processText(message.text) }}
        />
        
        {/* 图片 - 使用 Fancybox */}
        {message.image && message.image.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.image.map((img, idx) => (
              <a 
                key={idx} 
                href={img}
                data-fancybox={galleryId}
                data-caption={`图片 ${idx + 1}`}
                className={`shuoshuo-img block rounded-xl overflow-hidden cursor-zoom-in ${idx === 0 ? 'w-full aspect-[1.8]' : 'w-[calc(25%-6px)] aspect-square'}`}
              >
                <img 
                  src={img} 
                  alt={`图片 ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
        
        {/* 底部操作栏 */}
        <div className="shuoshuo-footer mt-4 pt-3 border-t border-dashed">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="shuoshuo-tag text-sm rounded-xl px-3 py-1 flex-shrink-0">
              🏷️ 说说
            </span>
            {message.views && (
              <span className="shuoshuo-views text-sm flex-shrink-0">👁 {message.views}</span>
            )}
            
            <div className="ml-auto">
              <EmojiReaction 
                messageId={id}
                reactions={reactions}
                onReact={onReact}
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .shuoshuo-card {
          background: var(--bg-card);
          border-color: var(--accent-color);
          border-color: rgba(245, 158, 11, 0.3);
        }
        .shuoshuo-card:hover {
          border-color: var(--accent-color);
        }
        .shuoshuo-header {
          border-color: var(--border-color);
        }
        .shuoshuo-name {
          color: var(--accent-color);
        }
        .shuoshuo-time {
          color: var(--text-muted);
        }
        .shuoshuo-text {
          color: var(--text-secondary);
        }
        .shuoshuo-text a {
          color: var(--accent-color);
        }
        .shuoshuo-text a:hover {
          opacity: 0.8;
        }
        .shuoshuo-img {
          background: var(--border-color);
        }
        .shuoshuo-footer {
          border-color: var(--border-color);
        }
        .shuoshuo-tag {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent-color);
        }
        .shuoshuo-views {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default function ShuoshuoView() {
  const [messages, setMessages] = useState<Record<string, ChannelMessage>>({});
  const [reactions, setReactions] = useState<MessageReactions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [nextBefore, setNextBefore] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [fancyboxLoaded, setFancyboxLoaded] = useState(false);
  
  const API_URL = 'https://tg-api.050815.xyz/';
  
  // 加载 Fancybox
  useEffect(() => {
    // 加载 CSS
    if (!document.getElementById('fancybox-css')) {
      const link = document.createElement('link');
      link.id = 'fancybox-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
      document.head.appendChild(link);
    }
    
    // 加载 JS
    if (!window.Fancybox) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
      script.onload = () => {
        setFancyboxLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setFancyboxLoaded(true);
    }
    
    return () => {
      // 清理 Fancybox 实例
      if (window.Fancybox) {
        window.Fancybox.destroy();
      }
    };
  }, []);
  
  // 初始化 Fancybox
  useEffect(() => {
    if (fancyboxLoaded && window.Fancybox && Object.keys(messages).length > 0) {
      window.Fancybox.bind('[data-fancybox]', {
        groupAll: true,
        Carousel: {
          infinite: false,
        },
        Toolbar: {
          display: {
            left: [],
            middle: ['infobar'],
            right: ['download', 'slideshow', 'thumbs', 'close'],
          },
        },
        Thumbs: {
          autoStart: true,
        },
      });
    }
  }, [fancyboxLoaded, messages]);
  
  // 监听全局表情选择事件
  useEffect(() => {
    const handleEmojiSelect = (e: CustomEvent<{ messageId: string; emoji: string }>) => {
      const { messageId, emoji } = e.detail;
      handleReact(messageId, emoji);
    };
    
    window.addEventListener('emoji-select', handleEmojiSelect as EventListener);
    return () => window.removeEventListener('emoji-select', handleEmojiSelect as EventListener);
  }, []);
  
  const loadLocalReactions = useCallback(() => {
    const saved = localStorage.getItem('shuoshuo-reactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  }, []);
  
  const saveLocalReactions = useCallback((newReactions: MessageReactions) => {
    localStorage.setItem('shuoshuo-reactions', JSON.stringify(newReactions));
  }, []);
  
  const fetchMessages = useCallback(async (before: number = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?before=${before}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.ChannelMessageData) {
        if (before === 0) {
          setMessages(data.ChannelMessageData);
        } else {
          setMessages(prev => ({ ...prev, ...data.ChannelMessageData }));
        }
        setNextBefore(data.nextBefore);
        setHasMore(data.nextBefore !== 0);
        
        const localReactions = loadLocalReactions();
        setReactions(prev => ({ ...prev, ...localReactions }));
      }
    } catch (err: any) {
      console.error('获取说说失败:', err);
      setError(err.message || '获取数据失败');
      
      const cached = localStorage.getItem('shuoshuo-cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setMessages(parsed.messages);
          setReactions(parsed.reactions);
          setError('已显示缓存数据');
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [loadLocalReactions]);
  
  const handleReact = useCallback((messageId: string, emoji: string) => {
    setReactions(prev => {
      const current = prev[messageId] || [];
      const existingIndex = current.findIndex(r => r.emoji === emoji);
      
      let newReactions: ReactionItem[];
      
      if (existingIndex >= 0) {
        const existing = current[existingIndex];
        if (existing.reacted) {
          newReactions = current.map((r, idx) => 
            idx === existingIndex 
              ? { ...r, count: Math.max(0, r.count - 1), reacted: false }
              : r
          ).filter(r => r.count > 0);
        } else {
          newReactions = current.map((r, idx) => 
            idx === existingIndex 
              ? { ...r, count: r.count + 1, reacted: true }
              : r
          );
        }
      } else {
        newReactions = [...current, { emoji, count: 1, reacted: true }];
      }
      
      const updated = { ...prev, [messageId]: newReactions };
      saveLocalReactions(updated);
      return updated;
    });
  }, [saveLocalReactions]);
  
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchMessages(nextBefore);
    }
  };
  
  const refresh = () => {
    setMessages({});
    setReactions({});
    setNextBefore(0);
    setHasMore(true);
    fetchMessages(0);
  };
  
  useEffect(() => {
    fetchMessages(0);
  }, [fetchMessages]);
  
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem('shuoshuo-cache', JSON.stringify({ messages, reactions }));
    }
  }, [messages, reactions]);
  
  const messageEntries = Object.entries(messages).sort((a, b) => b[1].time - a[1].time);
  
  return (
    <Animation id="shuoshuo">
      {/* 全局表情选择器 */}
      <GlobalEmojiPicker />
      
      <div className="shuoshuo-page">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-amber-600" />
            <h1 className="shuoshuo-title text-3xl font-bold">说说</h1>
          </div>
          <button 
            onClick={refresh}
            className="shuoshuo-refresh-btn flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>刷新</span>
          </button>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="shuoshuo-error mb-4 p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* 说说列表 */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-3">
          {messageEntries.map(([id, message]) => (
            <ShuoshuoCard 
              key={id}
              id={id}
              message={message}
              reactions={reactions[id] || []}
              onReact={handleReact}
              galleryId={`gallery-${id}`}
            />
          ))}
        </div>
        
        {/* 加载更多 */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="shuoshuo-load-more px-8 py-3 rounded-xl border transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  加载中...
                </span>
              ) : (
                '加载更多'
              )}
            </button>
          </div>
        )}
        
        {/* 到底提示 */}
        {!hasMore && messageEntries.length > 0 && (
          <div className="shuoshuo-end relative h-10 flex items-center justify-center my-8">
            <span className="px-5 text-sm">已经到底啦~</span>
          </div>
        )}
        
        {/* 空状态 */}
        {!loading && messageEntries.length === 0 && !error && (
          <div className="shuoshuo-empty text-center py-12 rounded-xl border">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-amber-200" />
            <p>暂无说说内容</p>
          </div>
        )}
        
        {/* 骨架屏 */}
        {loading && messageEntries.length === 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="shuoshuo-skeleton break-inside-avoid mb-3 h-48 animate-pulse rounded-xl" />
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .shuoshuo-title {
          color: var(--text-primary);
        }
        .shuoshuo-refresh-btn {
          background: var(--bg-card);
          border-color: var(--border-color);
          color: var(--accent-color);
        }
        .shuoshuo-refresh-btn:hover {
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px var(--shadow-color);
        }
        .shuoshuo-error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .shuoshuo-load-more {
          background: var(--bg-card);
          border-color: var(--border-color);
          color: var(--accent-color);
        }
        .shuoshuo-load-more:hover {
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px var(--shadow-color);
        }
        .shuoshuo-end span {
          background: var(--bg-card);
          color: var(--text-muted);
        }
        .shuoshuo-empty {
          background: var(--bg-card);
          border-color: var(--border-color);
          color: var(--text-muted);
        }
        .shuoshuo-skeleton {
          background: var(--border-color);
        }
      `}</style>
    </Animation>
  );
}
