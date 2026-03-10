import { useState, useEffect, useCallback, useRef } from "react";
import Animation from "../components/Animation";
import { MessageSquare, Send, Trash2, Image as ImageIcon, X, Loader2, Lock, User } from "lucide-react";
import { marked } from "marked";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const API_BASE = "https://artitalk-api.050815.xyz/api";

interface Shuoshuo {
  id: string;
  attributes: {
    atContentMd: string;
    atContentHtml: string;
    userOs?: string;
    avatar?: string;
  };
  createdAt: string;
  user: {
    username: string;
    img?: string;
  };
}

interface AuthUser {
  id: string;
  username: string;
  img?: string;
  role: string;
}

export default function ArtitalkView() {
  const [shuoshuos, setShuoshuos] = useState<Shuoshuo[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string>(localStorage.getItem("artitalk_token") || "");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get headers with auth token
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // Fetch shuoshuo list
  const fetchShuoshuos = useCallback(async (pageNum = 0, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shuoshuo?page=${pageNum}&pageSize=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (append) {
        setShuoshuos((prev) => [...prev, ...data]);
      } else {
        setShuoshuos(data);
      }
      setHasMore(data.length === 10);
    } catch (err) {
      setError("获取说说失败，请稍后重试");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Custom markdown renderer with Fancybox support
  const renderMarkdown = (content: string) => {
    const renderer = new marked.Renderer();
    
    // Override image renderer to add Fancybox
    renderer.image = (href: string, title: string | null, text: string) => {
      return `<a href="${href}" data-fancybox="gallery" data-caption="${text || title || ''}">
        <img src="${href}" alt="${text}" loading="lazy" />
      </a>`;
    };
    
    marked.setOptions({ renderer });
    return marked(content);
  };

  useEffect(() => {
    fetchShuoshuos(0);
    // Check if user is logged in
    const savedUser = localStorage.getItem("artitalk_user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    
    // Initialize Fancybox
    Fancybox.bind('[data-fancybox="gallery"]', {
      // @ts-ignore - Fancybox options type mismatch
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [
            "zoomIn",
            "zoomOut",
            "toggle1to1",
            "rotateCCW",
            "rotateCW",
            "flipX",
            "flipY",
          ],
          right: ["slideshow", "fullscreen", "thumbs", "close"],
        },
      },
      Thumbs: {
        type: "classic",
      },
    } as any);
    
    return () => {
      Fancybox.destroy();
    };
  }, [fetchShuoshuos, token]);

  // Login
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      return;
    }

    try {
      console.log("Attempting login with:", { username: username.trim(), password: "***" });
      
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });

      const data = await res.json();
      console.log("Login response:", res.status, data);

      if (!res.ok) {
        setError(data.message || data.error || `登录失败 (${res.status})`);
        return;
      }

      localStorage.setItem("artitalk_token", data.token);
      localStorage.setItem("artitalk_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      setError(null);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setError("登录失败，请稍后重试");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("artitalk_token");
    localStorage.removeItem("artitalk_user");
    setToken("");
    setUser(null);
  };

  // Submit new shuoshuo (admin only)
  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      setError("请输入内容或添加图片");
      return;
    }

    if (!token || !user || user.role !== "admin") {
      setShowLogin(true);
      setError("需要管理员权限才能发布说说");
      return;
    }

    setSubmitting(true);
    setError(null);

    // Convert content to HTML (simple conversion)
    const html = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    // Get OS
    const userAgent = navigator.userAgent;
    let userOs = "Unknown";
    if (userAgent.indexOf("Windows") !== -1) userOs = "windows";
    else if (userAgent.indexOf("Mac") !== -1) userOs = "Mac";
    else if (userAgent.indexOf("Linux") !== -1) userOs = "Linux";
    else if (userAgent.indexOf("Android") !== -1) userOs = "Android";
    else if (userAgent.indexOf("iOS") !== -1) userOs = "iOS";

    try {
      const res = await fetch(`${API_BASE}/shuoshuo`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          atContentMd: content,
          atContentHtml: html,
          userOs: userOs,
          avatar: user?.img || "https://fastly.jsdelivr.net/gh/drew233/cdn/logol.png",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          setShowLogin(true);
          throw new Error("登录已过期，请重新登录");
        }
        throw new Error(data.message || "发布失败");
      }

      setContent("");
      setImages([]);
      setPage(0);
      fetchShuoshuos(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败，请稍后重试");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete shuoshuo (admin only)
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条说说吗？")) return;

    if (!token || !user || user.role !== "admin") {
      setShowLogin(true);
      setError("需要管理员权限才能删除说说");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/shuoshuo/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          setShowLogin(true);
          throw new Error("登录已过期，请重新登录");
        }
        throw new Error(data.message || "删除失败");
      }

      setShuoshuos((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败，请稍后重试");
      console.error(err);
    }
  };

  // Load more
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchShuoshuos(nextPage, true);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAdmin = user?.role === "admin";

  return (
    <Animation id="artitalk">
      <div className="artitalk-page">
        {/* Header */}
        <div className="artitalk-header">
          <div className="artitalk-title">
            <div className="artitalk-icon">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1>Artitalk</h1>
            <span className="artitalk-count">{shuoshuos.length} 条说说</span>
          </div>
          {user ? (
            <div className="user-info">
              <span className="user-name">
                {user.username}
                {isAdmin && <span className="admin-badge">管理员</span>}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                退出
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="login-toggle-btn"
            >
              <Lock className="w-4 h-4" />
              登录
            </button>
          )}
        </div>

        {/* Login Form */}
        {showLogin && !user && (
          <div className="login-card">
            <label className="login-label">
              <Lock className="w-4 h-4" />
              管理员登录
            </label>
            <div className="login-input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                className="login-input"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="login-input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={handleLogin}
                className="login-btn"
                disabled={!username.trim() || !password.trim()}
              >
                登录
              </button>
            </div>
            <p className="login-hint">
              需要管理员账户才能发布和删除说说
            </p>
          </div>
        )}

        {/* Post Form (Admin Only) */}
        {isAdmin && (
          <div className="artitalk-input-card">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的想法..."
              className="artitalk-textarea"
              rows={3}
            />

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`preview-${index}`} />
                    <button
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                      className="remove-image-btn"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="artitalk-actions">
              <div className="action-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={() => {}}
                  className="hidden"
                />
                <button
                  onClick={() => alert("图片上传功能需要后端支持，暂不可用")}
                  disabled={uploading}
                  className="image-upload-btn"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  图片
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!content.trim() && images.length === 0)}
                className="submit-btn"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                发布
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {/* Shuoshuo List */}
        <div className="shuoshuo-list">
          {loading && shuoshuos.length === 0 ? (
            <div className="loading-state">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>加载中...</span>
            </div>
          ) : shuoshuos.length === 0 ? (
            <div className="empty-state">
              <MessageSquare className="w-12 h-12" />
              <p>还没有说说，来发布第一条吧！</p>
            </div>
          ) : (
            shuoshuos.map((item) => (
              <div key={item.id} className="shuoshuo-card">
                <div className="shuoshuo-header">
                  <div className="shuoshuo-avatar">
                    <img
                      src={item.user.img || item.attributes.avatar || "https://fastly.jsdelivr.net/gh/drew233/cdn/logol.png"}
                      alt="avatar"
                    />
                  </div>
                  <div className="shuoshuo-meta">
                    <span className="shuoshuo-author">{item.user.username}</span>
                    <span className="shuoshuo-time">{formatDate(item.createdAt)}</span>
                    {item.attributes.userOs && (
                      <span className="shuoshuo-os">{item.attributes.userOs}</span>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="delete-btn"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div
                  className="shuoshuo-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(item.attributes.atContentMd) }}
                />
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && shuoshuos.length > 0 && (
          <div className="load-more">
            <button onClick={loadMore} disabled={loading} className="load-more-btn">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "加载更多"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .artitalk-page {
          padding: 20px;
        }

        .artitalk-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .artitalk-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .artitalk-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .artitalk-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .artitalk-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .admin-badge {
          padding: 2px 8px;
          border-radius: 4px;
          background: var(--accent-color);
          color: white;
          font-size: 11px;
          font-weight: 500;
        }

        .logout-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .login-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-toggle-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .login-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-color);
          margin-bottom: 24px;
        }

        .login-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .login-input-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .login-input {
          flex: 1;
          min-width: 120px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .login-input:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .login-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          background: var(--accent-color);
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-hint {
          margin: 12px 0 0 0;
          font-size: 12px;
          color: var(--text-muted);
        }

        .artitalk-input-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-color);
          margin-bottom: 24px;
        }

        .artitalk-textarea {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 15px;
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }

        .artitalk-textarea:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .artitalk-textarea::placeholder {
          color: var(--text-muted);
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
          margin-top: 12px;
        }

        .image-preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .image-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-image-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .artitalk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .image-upload-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .image-upload-btn:hover:not(:disabled) {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .image-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 8px;
          border: none;
          background: var(--accent-color);
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          margin-top: 12px;
          padding: 10px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          font-size: 14px;
        }

        .shuoshuo-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: var(--text-muted);
          gap: 16px;
        }

        .empty-state p {
          font-size: 15px;
        }

        .shuoshuo-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-color);
          transition: box-shadow 0.2s;
        }

        .shuoshuo-card:hover {
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        .shuoshuo-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .shuoshuo-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .shuoshuo-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .shuoshuo-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .shuoshuo-author {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 15px;
        }

        .shuoshuo-time {
          font-size: 13px;
          color: var(--text-muted);
        }

        .shuoshuo-os {
          font-size: 11px;
          color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 4px;
          width: fit-content;
        }

        .delete-btn {
          padding: 8px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .shuoshuo-content {
          color: var(--text-primary);
          font-size: 15px;
          line-height: 1.6;
        }

        .shuoshuo-content > *:first-child {
          margin-top: 0;
        }

        .shuoshuo-content > *:last-child {
          margin-bottom: 0;
        }

        .shuoshuo-content p {
          margin: 0 0 12px 0;
        }

        .shuoshuo-content strong {
          font-weight: 600;
        }

        .shuoshuo-content em {
          font-style: italic;
        }

        .shuoshuo-content code {
          background: var(--bg-secondary);
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .shuoshuo-content pre {
          background: var(--bg-secondary);
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 12px 0;
        }

        .shuoshuo-content pre code {
          background: transparent;
          padding: 0;
        }

        .shuoshuo-content a {
          color: var(--accent-color);
          text-decoration: none;
        }

        .shuoshuo-content a:hover {
          text-decoration: underline;
        }

        .shuoshuo-content a[data-fancybox] {
          display: inline-block;
          cursor: zoom-in;
        }

        .shuoshuo-content a[data-fancybox] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .shuoshuo-content a[data-fancybox]:hover img {
          transform: scale(1.02);
          box-shadow: 0 4px 12px var(--shadow-color);
        }

        .shuoshuo-content ul {
          list-style-type: disc;
          margin: 12px 0;
          padding-left: 24px;
        }

        .shuoshuo-content ol {
          list-style-type: decimal;
          margin: 12px 0;
          padding-left: 24px;
        }

        .shuoshuo-content li {
          margin: 4px 0;
          display: list-item;
        }

        .shuoshuo-content blockquote {
          border-left: 4px solid var(--accent-color);
          padding-left: 12px;
          margin: 12px 0;
          color: var(--text-secondary);
          font-style: italic;
        }

        .shuoshuo-content h1,
        .shuoshuo-content h2,
        .shuoshuo-content h3,
        .shuoshuo-content h4,
        .shuoshuo-content h5,
        .shuoshuo-content h6 {
          margin: 16px 0 8px 0;
          font-weight: 600;
        }

        .shuoshuo-content h1 {
          font-size: 1.5em;
        }

        .shuoshuo-content h2 {
          font-size: 1.3em;
        }

        .shuoshuo-content h3 {
          font-size: 1.1em;
        }

        .load-more {
          text-align: center;
          margin-top: 24px;
        }

        .load-more-btn {
          padding: 12px 32px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .load-more-btn:hover:not(:disabled) {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .load-more-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes animate-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: animate-spin 1s linear infinite;
        }

        @media (max-width: 640px) {
          .artitalk-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .login-input-group {
            flex-direction: column;
          }

          .login-input {
            width: 100%;
          }
        }
      `}</style>
    </Animation>
  );
}
