import { useState, useEffect } from "react";
import Animation from "../components/Animation";
import FriendLevelLegend from "../components/FriendLevelLegend";
import FriendsList from "../components/FriendsList";
import DisconnectedFriendsList from "../components/DisconnectedFriendsList";
import SiteInfo from "../components/SiteInfo";
import ErrorBoundary from "../components/ErrorBoundary";
import config from "../../config";
import { Link2, Mail, Loader2 } from "lucide-react";

// 友链数据接口
interface FriendLink {
  name: string;
  description: string;
  url: string;
  avatar: string;
  addDate?: string;
  recommended?: boolean;
  disconnected?: boolean;
}

// 远程友链数据源
const REMOTE_FRIENDS_URL = "https://friends.152531.xyz/data/friends.ts";

export default function FriendsView() {
  const [friendLinks, setFriendLinks] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await fetch(REMOTE_FRIENDS_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        
        // 解析 TypeScript 文件中的 FRIEND_LINKS 数组
        const match = text.match(/export const FRIEND_LINKS: FriendLink\[\] = (\[[\s\S]*?\]);/);
        
        if (match && match[1]) {
          // 将 TypeScript 对象转换为 JSON 兼容格式
          let jsonStr = match[1]
            .replace(/'/g, '"')
            .replace(/,\s*([}\]])/g, "$1");
          
          // 只匹配对象键名（在行首或 { 后面）
          jsonStr = jsonStr.replace(/([{\s,])(\w+):/g, '$1"$2":');
          
          const links: FriendLink[] = JSON.parse(jsonStr);
          setFriendLinks(links);
        } else {
          throw new Error("无法解析友链数据");
        }
      } catch (err: any) {
        console.error("获取友链失败:", err);
        setError(err.message || "获取友链数据失败");
        
        // 尝试使用本地缓存
        const cached = localStorage.getItem("friends-cache");
        if (cached) {
          try {
            setFriendLinks(JSON.parse(cached));
            setError("已显示缓存数据");
          } catch {
            // 忽略缓存错误
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // 缓存友链数据
  useEffect(() => {
    if (friendLinks.length > 0) {
      localStorage.setItem("friends-cache", JSON.stringify(friendLinks));
    }
  }, [friendLinks]);

  return (
    <Animation id="friends">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link2 className="w-8 h-8 text-slate-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">友情链接</h1>
          </div>
          <p className="text-lg text-slate-600 italic">
            探索更多优秀的内容创作者和技术伙伴。
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            <span className="ml-2 text-slate-500">加载友链中...</span>
          </div>
        ) : (
          <>
            {/* Legend */}
            <ErrorBoundary>
              <FriendLevelLegend />
            </ErrorBoundary>

            {/* Friends List with Pagination */}
            <ErrorBoundary>
              <FriendsList links={friendLinks} />
            </ErrorBoundary>

            {/* Disconnected Friends List */}
            <ErrorBoundary>
              <DisconnectedFriendsList links={friendLinks} />
            </ErrorBoundary>
          </>
        )}

        {/* Apply Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 申请友链 */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-900">申请友链</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              欢迎技术与生活类博客交换友链
            </p>
            <p className="text-sm text-slate-600 mb-4">
              在Github仓库添加 <a href="https://github.com/yxksw/Friends/issues/new?template=friend-link-request.yml" className="text-slate-800 hover:underline font-medium">议题</a>
            </p>
            {/* 提示信息框 */}
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 p-4 text-center">
              <p className="text-sm text-slate-700 font-medium mb-1">
                博客名称、描述、地址、头像等信息
              </p>
              <p className="text-xs text-slate-500">
                任意格式均可，包含基本信息即可
              </p>
            </div>
          </div>

          {/* 本站信息 */}
          <ErrorBoundary>
            <SiteInfo
              name={config.Name}
              url={config.homeurl || window.location.origin}
              description={config.jieshao}
              avatar={config.Avatar}
            />
          </ErrorBoundary>
        </div>
      </div>
    </Animation>
  );
}
