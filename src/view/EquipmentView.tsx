import { useState, useMemo } from "react";
import Animation from "../components/Animation";
import { Laptop, Package, ExternalLink, Calendar, Tag } from "lucide-react";

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

const EQUIPMENT_DATA: EquipmentItem[] = [
  {
    name: "机械革命 极光PRO 2022",
    image: "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/jxgm.avif",
    src: "https://www.mechrevo.com/",
    category: '硬件',
    desc: "主力开发笔记本，轻薄游戏本，性价比之选",
    info: {
      "芯片": "Intel® Core™ i7-12700H",
      "内存": "16GB DDR4 3200MHz",
      "显卡": "NVIDIA® GeForce RTX™ 3060",
      "存储": "512GB PCIe 3.0 SSD",
      "屏幕": "15.6英寸 165Hz",
      "重量": "2.07kg"
    },
    tags: ['游戏本', 'Intel', 'RTX3060'],
    date: "2022-07-15",
    money: 7299,
  },
  {
    name: "罗技 G502 HERO",
    image: "https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png",
    src: "https://www.logitechg.com/zh-cn/shop/p/g502-hero-gaming-mouse.910-005474",
    category: '外设',
    desc: "专为先进游戏性能而设计，配备 HERO 25K 游戏传感器，具有亚微米精度追踪、可自定义 LIGHTSYNC RGB",
    info: {
      "传感器": "HERO 25K",
      "DPI": "200 - 25,600",
      "按键": "11个可编程",
      "RGB": "LIGHTSYNC",
      "配重": "5个3.6g配重",
      "重量": "121g"
    },
    tags: ['鼠标', '游戏', 'RGB'],
    date: "2025-04-15",
    money: 209,
  },
  {
    name: "西伯利亚 S21GS",
    image: "https://27450057.s21i.faiusr.com/2/ABUIABACGAAgsf3NtwYo4KunuAMwoAY4oAY.jpg.webp",
    src: "https://www.xiberia.net/h-pd-138.html",
    category: '外设',
    desc: "无线电竞耳机，2.4G/蓝牙双模，低延迟游戏耳机",
    info: {
      "类型": "无线电竞耳机",
      "连接": "2.4G/蓝牙5.3",
      "驱动": "50mm单元",
      "续航": "约30小时",
      "重量": "约280g",
      "颜色": "铁灰色/火焰风暴"
    },
    tags: ['耳机', '无线', '游戏'],
    date: "2024-04-15",
    money: 299,
  },
  {
    name: "iQOO 11",
    image: "https://shopstatic.vivo.com.cn/vivoshop/commodity/52/10007952_1669636269985_750x750.png.webp",
    src: "https://shop.vivo.com.cn/product/10007952?skuId=125337",
    category: '硬件',
    desc: "主力手机，骁龙8 Gen2，2K 144Hz E6屏幕，游戏性能强悍",
    info: {
      "芯片": "骁龙 8 Gen 2",
      "内存": "16GB LPDDR5X",
      "存储": "512GB UFS 4.0",
      "屏幕": "6.78英寸 144Hz",
      "电池": "5000mAh",
      "重量": "205g"
    },
    tags: ['手机', '安卓', '游戏'],
    date: "2022-12-12",
    money: 4399,
  },
  {
    name: "iQOO TWS 1e",
    image: "https://shopstatic.vivo.com.cn/vivoshop/commodity/26/10009426_1709192548304_750x750.png.webp",
    src: "https://shop.vivo.com.cn/product/10009286?skuId=130649",
    category: '外设',
    desc: "真无线降噪耳机，44小时超长续航，AI通话降噪",
    info: {
      "降噪": "主动降噪",
      "续航": "44小时(含充电盒)",
      "驱动": "11mm动圈",
      "防水": "IP54",
      "连接": "蓝牙5.3",
      "重量": "4.4g/只"
    },
    tags: ['耳机', '降噪', '无线'],
    date: "2023-12-21",
    money: 179,
  },
];

const CATEGORIES = [
  { key: '硬件', label: '硬件', icon: Laptop, color: '#3b82f6' },
  { key: '外设', label: '外设', icon: Package, color: '#10b981' },
] as const;

export default function EquipmentView() {
  const [activeCategory, setActiveCategory] = useState<string>('硬件');

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_DATA.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const getCategoryCount = (category: string) => {
    return EQUIPMENT_DATA.filter(item => item.category === category).length;
  };

  const totalMoney = useMemo(() => {
    return EQUIPMENT_DATA.reduce((sum, item) => sum + item.money, 0);
  }, []);

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
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{EQUIPMENT_DATA.length}</p>
              <p className="equipment-stat-label text-sm">装备总数</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{CATEGORIES.length}</p>
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
            {CATEGORIES.map((category) => {
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
            <EquipmentCard key={index} item={item} />
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

function EquipmentCard({ item }: { item: EquipmentItem }) {
  const categoryConfig = CATEGORIES.find(c => c.key === item.category);
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
