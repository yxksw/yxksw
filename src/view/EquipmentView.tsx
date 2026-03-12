import { useState, useEffect, useMemo } from "react";
import Animation from "../components/Animation";
import { Laptop, Package, ExternalLink, Calendar, Tag, LucideIcon } from "lucide-react";

interface EquipmentItem {
  name: string;
  image: string;
  src: string;
  category: '硬件' | '外设' | '软件';
  desc: string;
  info: Record<string, string>;
  tags: string[];
  date: string;
  money: number;
}

interface CategoryConfig {
  key: '硬件' | '外设' | '软件';
  label: string;
  icon: string;
  color: string;
}

type CategoryWithIcon = Omit<CategoryConfig, 'icon'> & {
  icon: LucideIcon;
};

interface EquipmentData {
  categories: CategoryConfig[];
  items: EquipmentItem[];
}

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Package,
};

export default function EquipmentView() {
  const [data, setData] = useState<EquipmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('硬件');

  useEffect(() => {
    fetch('/data/equipment.json')
      .then(res => res.json())
      .then((data: EquipmentData) => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('获取装备数据失败:', err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo<CategoryWithIcon[]>(() => {
    if (!data) return [];
    return data.categories.map(cat => ({
      ...cat,
      icon: iconMap[cat.icon] || Package,
    }));
  }, [data]);

  const filteredEquipment = useMemo(() => {
    if (!data) return [];
    return data.items.filter(item => item.category === activeCategory);
  }, [data, activeCategory]);

  const getCategoryCount = (category: string) => {
    if (!data) return 0;
    return data.items.filter(item => item.category === category).length;
  };

  const totalMoney = useMemo(() => {
    if (!data) return 0;
    return data.items.reduce((sum, item) => sum + item.money, 0);
  }, [data]);

  if (loading) {
    return (
      <Animation id="equipment">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </Animation>
    );
  }

  if (!data) {
    return (
      <Animation id="equipment">
        <div className="text-center py-12">
          <p className="text-gray-500">加载装备数据失败</p>
        </div>
      </Animation>
    );
  }

  return (
    <Animation id="equipment">
      <div className="equipment-page animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Laptop className="w-8 h-8" style={{ color: 'var(--accent-color)' }} />
            <h1 className="equipment-title text-3xl sm:text-4xl font-bold">我的装备</h1>
          </div>
          <p className="equipment-desc text-lg">
            记录我的生产力工具，分享使用体验
          </p>
        </div>

        {/* 统计信息 */}
        <div className="equipment-stats rounded-2xl border p-6 mb-8 text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{data.items.length}</p>
              <p className="equipment-stat-label text-sm">装备总数</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{categories.length}</p>
              <p className="equipment-stat-label text-sm">分类数量</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>¥{(totalMoney / 10000).toFixed(1)}w</p>
              <p className="equipment-stat-label text-sm">总价值</p>
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex justify-center mb-8">
          <div className="equipment-tabs inline-flex rounded-xl p-1.5">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.key;
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`equipment-tab flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    color: isActive ? category.color : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                  <span className={`equipment-tab-count text-xs px-1.5 py-0.5 rounded-full`}>
                    {getCategoryCount(category.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 装备列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEquipment.map((item, index) => (
            <EquipmentCard key={index} item={item} categories={categories} />
          ))}
        </div>

        {/* 空状态 */}
        {filteredEquipment.length === 0 && (
          <div className="equipment-empty text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p>该分类下暂无装备</p>
          </div>
        )}
      </div>
      <style>{`
        .equipment-title {
          color: var(--text-primary);
        }
        .equipment-desc {
          color: var(--text-secondary);
        }
        .equipment-stats {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
          border-color: rgba(59, 130, 246, 0.2);
        }
        .equipment-stat-label {
          color: var(--text-secondary);
        }
        .equipment-tabs {
          background: var(--border-color);
        }
        .equipment-tab {
          color: var(--text-muted);
        }
        .equipment-tab:hover {
          color: var(--text-primary);
        }
        .equipment-tab.active {
          background: var(--bg-card);
          color: var(--text-primary);
          box-shadow: 0 2px 8px var(--shadow-color);
        }
        .equipment-tab-count {
          background: var(--border-color);
        }
        .equipment-tab.active .equipment-tab-count {
          background: var(--border-color);
        }
        .equipment-empty {
          color: var(--text-muted);
        }
      `}</style>
    </Animation>
  );
}

function EquipmentCard({ item, categories }: { item: EquipmentItem; categories: CategoryWithIcon[] }) {
  const categoryConfig = categories.find(c => c.key === item.category);
  const categoryColor = categoryConfig?.color || '#3b82f6';

  return (
    <>
      <div className="equipment-card group rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* 图片区域 */}
        <div className="equipment-card-image relative h-56 flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* 分类标签 */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {item.category}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {/* 标题 */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="equipment-card-title text-xl font-bold line-clamp-1">
              {item.name}
            </h3>
          </div>

          {/* 描述 */}
          <p className="equipment-card-desc text-sm mb-4 line-clamp-2">
            {item.desc}
          </p>

          {/* 规格参数 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(item.info).slice(0, 4).map(([key, value]) => (
              <div key={key} className="equipment-card-info rounded-lg px-3 py-2">
                <p className="equipment-card-info-label text-xs mb-0.5">{key}</p>
                <p className="equipment-card-info-value text-sm font-medium truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="equipment-card-tag inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="equipment-card-footer flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm">
              <span className="equipment-card-date flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {item.date}
              </span>
              <span className="equipment-card-price font-semibold">
                ¥{item.money.toLocaleString()}
              </span>
            </div>
            <a
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
              className="equipment-card-link flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              详情
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <style>{`
        .equipment-card {
          background: var(--bg-card);
          border-color: var(--border-color);
        }
        .equipment-card-image {
          background: var(--border-color);
        }
        .equipment-card-title {
          color: var(--text-primary);
        }
        .equipment-card-desc {
          color: var(--text-secondary);
        }
        .equipment-card-info {
          background: var(--border-color);
        }
        .equipment-card-info-label {
          color: var(--text-muted);
        }
        .equipment-card-info-value {
          color: var(--text-primary);
        }
        .equipment-card-tag {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        .equipment-card-footer {
          border-color: var(--border-color);
        }
        .equipment-card-date {
          color: var(--text-muted);
        }
        .equipment-card-price {
          color: var(--text-primary);
        }
        .equipment-card-link {
          background: var(--border-color);
          color: var(--text-secondary);
        }
        .equipment-card-link:hover {
          background: var(--accent-color);
          color: white;
        }
      `}</style>
    </>
  );
}
