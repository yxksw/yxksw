import { useState } from "react";
import Animation from "../components/Animation";
import { Icon } from "@iconify/react";
import { Compass, ExternalLink, Wrench, BookOpen, GraduationCap, Gamepad2, Github, Globe, Cloud, FileText, Code, Code2, Palette, PlayCircle, HelpCircle, Gem, Youtube, Gamepad } from "lucide-react";
import sitesData from "../data/sites.json";

const LUCIDE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  BookOpen,
  GraduationCap,
  Gamepad2,
  Github,
  Globe,
  Cloud,
  FileText,
  Code,
  Code2,
  Palette,
  PlayCircle,
  HelpCircle,
  Gem,
  Youtube,
  Gamepad,
};

interface Site {
  name: string;
  url: string;
  description: string;
  icon: string;
}

interface Category {
  name: string;
  icon: string;
  sites: Site[];
}

export default function SitesView() {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const categories = sitesData.categories as Category[];
  const allSites = categories.flatMap((cat) => cat.sites);

  const filteredSites =
    activeCategory === "全部"
      ? allSites
      : categories.find((cat) => cat.name === activeCategory)?.sites || [];

  const categoryNames = ["全部", ...categories.map((cat) => cat.name)];

  return (
    <Animation id="sites">
      <div className="sites-page animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="w-8 h-8" style={{ color: "var(--accent-color)" }} />
            <h1 className="sites-title text-3xl sm:text-4xl font-bold">网址导航</h1>
          </div>
          <p className="sites-desc text-lg">收藏常用的网站，快速访问</p>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categoryNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`sites-category-btn px-4 py-2 rounded-xl border transition-all ${
                activeCategory === name ? "active" : ""
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* 网站卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site, index) => (
            <SiteCard key={index} site={site} />
          ))}
        </div>

        {/* 空状态 */}
        {filteredSites.length === 0 && (
          <div className="sites-empty text-center py-12">
            <Compass className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p>该分类下暂无网站</p>
          </div>
        )}
      </div>

      <style>{`
        .sites-title {
          color: var(--text-primary);
        }
        .sites-desc {
          color: var(--text-secondary);
        }
        .sites-category-btn {
          background: var(--bg-card);
          border-color: var(--border-color);
          color: var(--text-secondary);
        }
        .sites-category-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }
        .sites-category-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }
        .sites-empty {
          color: var(--text-muted);
        }
      `}</style>
    </Animation>
  );
}

function SiteCard({ site }: { site: Site }) {
  const iconName = site.icon;
  
  // 判断图标类型
  // 1. 图片链接: 以 http:// 或 https:// 开头
  // 2. Iconify 图标: 包含 ":" 例如 "mdi:github"
  // 3. Lucide 图标: 其他，例如 "Github", "Globe"
  const isImageUrl = iconName.startsWith("http://") || iconName.startsWith("https://");
  const isIconify = !isImageUrl && iconName.includes(":");
  
  const LucideIcon = !isImageUrl && !isIconify ? LUCIDE_ICON_MAP[iconName] || Globe : null;

  return (
    <>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="site-card group flex items-center gap-4 p-4 rounded-xl border transition-all hover:-translate-y-1"
      >
        <div className="site-icon w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          {isImageUrl ? (
            <img 
              src={iconName} 
              alt={site.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 图片加载失败时显示默认图标
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
                }
              }}
            />
          ) : isIconify ? (
            <Icon icon={iconName} className="w-6 h-6" />
          ) : LucideIcon ? (
            <LucideIcon className="w-6 h-6" />
          ) : (
            <Globe className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="site-name font-semibold truncate">{site.name}</h3>
          <p className="site-desc text-sm truncate">{site.description}</p>
        </div>
        <ExternalLink className="site-arrow w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      <style>{`
        .site-card {
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .site-card:hover {
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px var(--shadow-color);
        }
        .site-icon {
          background: var(--border-color);
          color: var(--accent-color);
        }
        .site-card:hover .site-icon {
          background: var(--accent-color);
          color: white;
        }
        .site-name {
          color: var(--text-primary);
        }
        .site-desc {
          color: var(--text-muted);
        }
        .site-arrow {
          color: var(--accent-color);
        }
      `}</style>
    </>
  );
}
