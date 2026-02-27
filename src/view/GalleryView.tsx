import { useState, useEffect, useRef, useCallback } from "react";
import Animation from "../components/Animation";
import { ImageIcon, LayoutGrid, Columns, ArrowUpDown } from "lucide-react";

interface ImageItem {
  id: number;
  url: string;
  type: "h" | "v";
}

const DOMAIN = "https://img.050815.xyz";
const RANDOM_JS_URL = "https://img.050815.xyz/random.js";

export default function GalleryView() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentType, setCurrentType] = useState<"h" | "v">("h");
  const [isReverse, setIsReverse] = useState(false);
  const [counts, setCounts] = useState({ h: 0, v: 0 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextIndex, setNextIndex] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(RANDOM_JS_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const text = await res.text();
      const m = text.match(/var\s+counts\s*=\s*(\{[^;]+\})\s*;/);
      if (!m) throw new Error("counts not found");
      const parsed = JSON.parse(m[1]);
      setCounts({
        h: Number(parsed.h) || 0,
        v: Number(parsed.v) || 0,
      });
    } catch (e) {
      setCounts({ h: 1074, v: 4003 });
    }
  }, []);

  // Build image URL
  const buildImgUrl = useCallback((n: number, type: "h" | "v") => {
    return `${DOMAIN}/ri/${type}/${n}.webp`;
  }, []);

  // Get next index
  const getNextIndex = useCallback((max: number, current: number, reverse: boolean) => {
    if (reverse) {
      if (current < 1) return null;
      return current - 1;
    }
    if (current > max) return null;
    return current + 1;
  }, []);

  // Load more images
  const loadMore = useCallback(async (batch = 20) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const max = counts[currentType];
    if (!max) {
      setLoading(false);
      return;
    }

    const newImages: ImageItem[] = [];
    let currentNextIndex = nextIndex;

    for (let i = 0; i < batch; i++) {
      const n = getNextIndex(max, currentNextIndex, isReverse);
      if (n === null) {
        setHasMore(false);
        break;
      }
      currentNextIndex = isReverse ? n : n + 1;
      newImages.push({
        id: n,
        url: buildImgUrl(n, currentType),
        type: currentType,
      });
    }

    setNextIndex(currentNextIndex);
    setImages((prev) => [...prev, ...newImages]);
    setLoading(false);
  }, [loading, hasMore, counts, currentType, nextIndex, isReverse, getNextIndex, buildImgUrl]);

  // Reset and reload
  const resetAndLoad = useCallback(() => {
    setImages([]);
    const max = counts[currentType];
    setNextIndex(isReverse ? max : 1);
    setHasMore(true);
    setTimeout(() => loadMore(24), 0);
  }, [counts, currentType, isReverse, loadMore]);

  // Change type
  const handleTypeChange = useCallback((type: "h" | "v") => {
    if (type === currentType) return;
    setCurrentType(type);
  }, [currentType]);

  // Toggle sort
  const toggleSort = useCallback(() => {
    setIsReverse((prev) => !prev);
  }, []);

  // Initialize
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Reset when type or sort changes
  useEffect(() => {
    if (counts.h > 0 || counts.v > 0) {
      resetAndLoad();
    }
  }, [currentType, isReverse, counts]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !loading && hasMore) {
          loadMore(20);
        }
      },
      { rootMargin: "600px 0px" }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, hasMore, loadMore]);

  // Get columns based on screen width
  const getColumns = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    return 2;
  };

  const columns = getColumns();
  const columnImages: ImageItem[][] = Array.from({ length: columns }, () => []);
  
  images.forEach((img, index) => {
    const columnIndex = index % columns;
    columnImages[columnIndex].push(img);
  });

  return (
    <Animation id="gallery">
      <div className="gallery-page">
        {/* Header */}
        <div className="gallery-header">
          <div className="gallery-title">
            <div className="gallery-icon">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h1>画廊</h1>
            <span className="gallery-count">
              共 {counts[currentType]} 张
            </span>
          </div>
          
          <div className="gallery-actions">
            <button
              onClick={() => handleTypeChange("h")}
              className={`gallery-btn ${currentType === "h" ? "active" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" />
              横屏
            </button>
            <button
              onClick={() => handleTypeChange("v")}
              className={`gallery-btn ${currentType === "v" ? "active" : ""}`}
            >
              <Columns className="w-4 h-4" />
              竖屏
            </button>
            <button
              onClick={toggleSort}
              className={`gallery-btn ${isReverse ? "active" : ""}`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {isReverse ? "最早" : "最新"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="gallery-desc">
          图片二进制自托管于：{" "}
          <a
            href="https://img.050815.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="gallery-link"
          >
            https://img.050815.xyz
          </a>
          <br />
          特别鸣谢：<b>锦瑟/瑞希</b> 大佬提供的图源
        </div>

        {/* Gallery Grid */}
        <div ref={galleryRef} className="gallery-grid">
          {columnImages.map((column, colIndex) => (
            <div key={colIndex} className="gallery-column">
              {column.map((image) => (
                <div
                  key={`${image.type}-${image.id}`}
                  className="gallery-item"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <div className="gallery-card">
                    <img
                      src={image.url}
                      alt={`gallery-${image.id}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="gallery-footer">
          {loading ? "加载中..." : hasMore ? "" : "已加载全部"}
        </div>

        {/* Sentinel */}
        <div ref={sentinelRef} className="gallery-sentinel" />

        {/* Lightbox */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img src={selectedImage} alt="preview" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .gallery-page {
          padding: 20px;
        }

        .gallery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .gallery-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .gallery-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--accent-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-title h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .gallery-count {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .gallery-actions {
          display: flex;
          gap: 8px;
        }

        .gallery-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gallery-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .gallery-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .gallery-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
          padding: 16px;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .gallery-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
        }

        .gallery-link:hover {
          text-decoration: underline;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .gallery-item {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .gallery-item:hover {
          transform: scale(1.02);
        }

        .gallery-card {
          background: var(--bg-card);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          transition: box-shadow 0.2s;
        }

        .gallery-card:hover {
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        .gallery-card img {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.3s;
        }

        .gallery-card img:hover {
          opacity: 0.95;
        }

        .gallery-footer {
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 24px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-sentinel {
          height: 16px;
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 90vh;
          border-radius: 8px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 640px) {
          .gallery-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .gallery-actions {
            width: 100%;
          }

          .gallery-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </Animation>
  );
}
