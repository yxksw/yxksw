import { useState, useRef, useEffect, useCallback } from "react";
import Animation from "../components/Animation";
import { Icon } from "@iconify/react";
import { Image as ImageIcon, Download, RotateCcw, Type, Palette, Layers, Settings, Search, Upload, X, Star, ExternalLink, Pencil, Wand2 } from "lucide-react";

const BASE_HEIGHT = 900;

interface Ratio {
  label: string;
  w: number;
  h: number;
  checked: boolean;
}

const DEFAULT_RATIOS: Ratio[] = [
  { label: "1:1", w: 1, h: 1, checked: false },
  { label: "4:3", w: 4, h: 3, checked: false },
  { label: "16:9", w: 16, h: 9, checked: true },
  { label: "21:9", w: 21, h: 9, checked: false },
];

export default function CoverView() {
  const [leftText, setLeftText] = useState("封面");
  const [rightText, setRightText] = useState("生成");
  const [iconName, setIconName] = useState("mdi:image");
  const [fontSize, setFontSize] = useState(64);
  const [iconSize, setIconSize] = useState(64);
  const [gap, setGap] = useState(20);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [iconColor, setIconColor] = useState("#000000");
  const [linkColor, setLinkColor] = useState(true);
  const [linkScale, setLinkScale] = useState(true);
  const [useOriginalIconColor, setUseOriginalIconColor] = useState(false);
  const [ratios, setRatios] = useState<Ratio[]>(DEFAULT_RATIOS);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgImageScale, setBgImageScale] = useState(1);
  const [bgImageX, setBgImageX] = useState(0);
  const [bgImageY, setBgImageY] = useState(0);
  const [iconSvg, setIconSvg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showIconSearch, setShowIconSearch] = useState(false);
  const [customFont, setCustomFont] = useState<string | null>(null);
  const [customFontName, setCustomFontName] = useState("");
  const [fontWeight, setFontWeight] = useState(400);
  const [textShadow, setTextShadow] = useState({ x: 0, y: 0, blur: 0, color: "#000000", alpha: 0 });
  const [iconShadow, setIconShadow] = useState({ x: 0, y: 0, blur: 0, color: "#000000", alpha: 0 });
  const [iconBgEnabled, setIconBgEnabled] = useState(false);
  const [iconBgColor, setIconBgColor] = useState("#000000");
  const [iconBgOpacity, setIconBgOpacity] = useState(0.2);
  const [iconBgRadius, setIconBgRadius] = useState(20);
  const [iconBgPadding, setIconBgPadding] = useState(10);
  const [transparentBg, setTransparentBg] = useState(false);
  const [exportFilename, setExportFilename] = useState("cover");
  const [shadowTarget, setShadowTarget] = useState<"both" | "text" | "icon">("both");
  const [exportFormat, setExportFormat] = useState<"png" | "svg">("png");
  const [exportScale, setExportScale] = useState(1);

  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const iconUploadRef = useRef<HTMLInputElement>(null);

  const activeRatios = ratios.filter((r) => r.checked);
  const visualRatios = activeRatios.length > 0 ? activeRatios : [ratios[2]];
  const maxWidthRatio = visualRatios.reduce((max, r) => (r.w / r.h > max ? r.w / r.h : max), 0);
  const canvasWidth = Math.round(BASE_HEIGHT * maxWidthRatio);
  const canvasHeight = BASE_HEIGHT;

  // Fetch icon SVG
  useEffect(() => {
    if (iconName?.includes(":")) {
      const [prefix, name] = iconName.split(":");
      fetch(`https://api.iconify.design/${prefix}/${name}.svg`)
        .then((res) => {
          if (!res.ok) throw new Error("Icon not found");
          return res.text();
        })
        .then((svg) => {
          let processedSvg = svg
            .replace(/width="[^"]*"/g, "")
            .replace(/height="[^"]*"/g, "");
          if (!useOriginalIconColor) {
            processedSvg = processedSvg.replace(/fill="[^"]*"/g, 'fill="currentColor"');
          }
          setIconSvg(processedSvg);
        })
        .catch(() => setIconSvg(""));
    } else {
      setIconSvg("");
    }
  }, [iconName, useOriginalIconColor]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=20`
      );
      const data = await res.json();
      setSearchResults(data.icons || []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (linkColor) setIconColor(newColor);
  };

  const handleIconColorChange = (newColor: string) => {
    setIconColor(newColor);
    if (linkColor) setTextColor(newColor);
  };

  const handleFontSizeChange = (newVal: number) => {
    if (linkScale) {
      const ratio = newVal / fontSize;
      setIconSize(Math.round(iconSize * ratio));
    }
    setFontSize(newVal);
  };

  const handleIconSizeChange = (newVal: number) => {
    if (linkScale) {
      const ratio = newVal / iconSize;
      setFontSize(Math.round(fontSize * ratio));
    }
    setIconSize(newVal);
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBgImage(ev.target?.result as string);
        setBgImageX(0);
        setBgImageY(0);
        setBgImageScale(1);
        setBgBlur(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fontData = ev.target?.result as ArrayBuffer;
        const fontName = file.name.replace(/\.[^/.]+$/, "");
        setCustomFontName(fontName);
        setCustomFont(fontName);
        const fontFace = new FontFace(fontName, fontData);
        fontFace.load().then((loadedFace) => {
          document.fonts.add(loadedFace);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setIconName("本地图标");
        setIconSvg(`<image href="${ev.target?.result}" width="100%" height="100%" />`);
      };
      reader.readAsDataURL(file);
    }
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const selectIcon = (icon: string) => {
    setIconName(icon);
    setSearchResults([]);
    setSearchQuery("");
    setShowIconSearch(false);
  };

  const toggleRatio = (index: number) => {
    const newRatios = [...ratios];
    newRatios[index].checked = !newRatios[index].checked;
    setRatios(newRatios);
  };

  const resetAll = () => {
    setLeftText("封面");
    setRightText("生成");
    setIconName("mdi:image");
    setFontSize(64);
    setIconSize(64);
    setGap(20);
    setTextColor("#000000");
    setBgColor("#ffffff");
    setBgOpacity(1);
    setIconColor("#000000");
    setLinkColor(true);
    setLinkScale(true);
    setUseOriginalIconColor(false);
    setRatios(DEFAULT_RATIOS);
    setBgImage(null);
    setBgBlur(0);
    setBgImageScale(1);
    setBgImageX(0);
    setBgImageY(0);
    setCustomFont(null);
    setCustomFontName("");
    setFontWeight(400);
    setTextShadow({ x: 0, y: 0, blur: 0, color: "#000000", alpha: 0 });
    setIconShadow({ x: 0, y: 0, blur: 0, color: "#000000", alpha: 0 });
    setIconBgEnabled(false);
    setTransparentBg(false);
    setExportFilename("cover");
    setShadowTarget("both");
    setExportFormat("png");
    setExportScale(1);
  };

  const updateShadow = (key: string, value: number | string) => {
    if (shadowTarget === "both" || shadowTarget === "text") {
      setTextShadow(prev => ({ ...prev, [key]: value }));
    }
    if (shadowTarget === "both" || shadowTarget === "icon") {
      setIconShadow(prev => ({ ...prev, [key]: value }));
    }
  };

  const createExportSvg = (ratio: Ratio, scale: number = 1) => {
    const ratioWidth = Math.round(BASE_HEIGHT * (ratio.w / ratio.h));
    const ratioHeight = BASE_HEIGHT;
    const xOffset = (canvasWidth - ratioWidth) / 2;
    const scaledWidth = ratioWidth * scale;
    const scaledHeight = ratioHeight * scale;

    const svgNs = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNs, "svg");
    svg.setAttribute("width", scaledWidth.toString());
    svg.setAttribute("height", scaledHeight.toString());
    svg.setAttribute("viewBox", `${xOffset} 0 ${ratioWidth} ${ratioHeight}`);
    svg.setAttribute("xmlns", svgNs);

    const bgRect = document.createElementNS(svgNs, "rect");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", transparentBg ? "none" : hexToRgba(bgColor, bgOpacity));
    svg.appendChild(bgRect);

    if (bgImage) {
      const img = document.createElementNS(svgNs, "image");
      img.setAttribute("href", bgImage);
      img.setAttribute("x", (canvasWidth / 2 - (canvasWidth * bgImageScale) / 2 + bgImageX - xOffset).toString());
      img.setAttribute("y", (canvasHeight / 2 - (canvasHeight * bgImageScale) / 2 + bgImageY).toString());
      img.setAttribute("width", (canvasWidth * bgImageScale).toString());
      img.setAttribute("height", (canvasHeight * bgImageScale).toString());
      img.setAttribute("preserveAspectRatio", "xMidYMid slice");
      if (bgBlur > 0) {
        const filter = document.createElementNS(svgNs, "filter");
        filter.setAttribute("id", "blur");
        const feBlur = document.createElementNS(svgNs, "feGaussianBlur");
        feBlur.setAttribute("stdDeviation", bgBlur.toString());
        filter.appendChild(feBlur);
        svg.appendChild(filter);
        img.setAttribute("filter", "url(#blur)");
      }
      svg.appendChild(img);
    }

    const contentG = document.createElementNS(svgNs, "g");
    contentG.setAttribute("transform", `translate(${ratioWidth / 2}, 0)`);

    const iconTotalHeight = iconBgEnabled ? iconSize + iconBgPadding * 2 : iconSize;
    const totalContentHeight = iconTotalHeight + gap + fontSize;
    const contentCenterY = ratioHeight / 2;
    const contentTopY = contentCenterY - totalContentHeight / 2;
    const iconY = contentTopY;

    if (iconBgEnabled) {
      const iconBg = document.createElementNS(svgNs, "rect");
      const bgSize = iconSize + iconBgPadding * 2;
      iconBg.setAttribute("x", (-bgSize / 2).toString());
      iconBg.setAttribute("y", iconY.toString());
      iconBg.setAttribute("width", bgSize.toString());
      iconBg.setAttribute("height", bgSize.toString());
      iconBg.setAttribute("rx", (bgSize * iconBgRadius / 100).toString());
      iconBg.setAttribute("fill", hexToRgba(iconBgColor, iconBgOpacity));
      contentG.appendChild(iconBg);
    }

    if (iconSvg) {
      const iconG = document.createElementNS(svgNs, "g");
      const iconYOffset = iconBgEnabled ? iconY + iconBgPadding : iconY;
      iconG.setAttribute("transform", `translate(${-iconSize / 2}, ${iconYOffset})`);
      if (iconShadow.alpha > 0) {
        iconG.setAttribute("filter", `drop-shadow(${iconShadow.x}px ${iconShadow.y}px ${iconShadow.blur}px ${hexToRgba(iconShadow.color, iconShadow.alpha)})`);
      }
      
      const parser = new DOMParser();
      const iconDoc = parser.parseFromString(iconSvg, "image/svg+xml");
      const iconElement = iconDoc.documentElement;
      const iconViewBox = iconElement.getAttribute("viewBox") || `0 0 24 24`;
      
      const iconSvgEl = document.createElementNS(svgNs, "svg");
      iconSvgEl.setAttribute("width", iconSize.toString());
      iconSvgEl.setAttribute("height", iconSize.toString());
      iconSvgEl.setAttribute("viewBox", iconViewBox);
      
      const svgContent = iconElement.innerHTML || iconElement.textContent || "";
      if (svgContent) {
        let processedContent = svgContent;
        if (!useOriginalIconColor) {
          processedContent = svgContent.replace(/fill="[^"]*"/g, `fill="${iconColor}"`);
        }
        iconSvgEl.innerHTML = processedContent;
      } else {
        Array.from(iconElement.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const cloned = node.cloneNode(true) as Element;
            if (!useOriginalIconColor && cloned.hasAttribute("fill")) {
              cloned.setAttribute("fill", iconColor);
            }
            iconSvgEl.appendChild(cloned);
          }
        });
      }
      
      iconG.appendChild(iconSvgEl);
      contentG.appendChild(iconG);
    }

    const textY = contentTopY + iconTotalHeight + gap + fontSize * 0.8;
    const textEl = document.createElementNS(svgNs, "text");
    textEl.setAttribute("x", "0");
    textEl.setAttribute("y", textY.toString());
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("font-family", customFont ? customFontName : "system-ui, -apple-system, sans-serif");
    textEl.setAttribute("font-size", fontSize.toString());
    textEl.setAttribute("font-weight", fontWeight.toString());
    textEl.setAttribute("fill", textColor);
    if (textShadow.alpha > 0) {
      textEl.setAttribute("filter", `drop-shadow(${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${hexToRgba(textShadow.color, textShadow.alpha)})`);
    }
    textEl.textContent = `${leftText}${rightText ? ' ' + rightText : ''}`;
    contentG.appendChild(textEl);

    svg.appendChild(contentG);
    return { svg, ratioWidth, ratioHeight };
  };

  const doExport = async () => {
    if (!svgRef.current) return;
    const ratiosToExport = activeRatios.length > 0 ? activeRatios : [ratios[2]];

    for (const ratio of ratiosToExport) {
      const { svg, ratioWidth, ratioHeight } = createExportSvg(ratio, exportScale);
      const svgData = new XMLSerializer().serializeToString(svg);

      if (exportFormat === "svg") {
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.href = url;
        const suffix = ratiosToExport.length > 1 ? `-${ratio.label.replace(":", "-")}` : "";
        link.download = `${exportFilename}${suffix}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = ratioWidth * exportScale;
          canvas.height = ratioHeight * exportScale;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                const suffix = ratiosToExport.length > 1 ? `-${ratio.label.replace(":", "-")}` : "";
                link.download = `${exportFilename}${suffix}.png`;
                link.click();
              }
            }, "image/png");
          }
          URL.revokeObjectURL(url);
        };
        img.onerror = () => URL.revokeObjectURL(url);
        img.src = url;
      }
    }
  };

  const textShadowStr = textShadow.alpha > 0
    ? `${textShadow.x}px ${textShadow.y}px ${textShadow.blur}px ${hexToRgba(textShadow.color, textShadow.alpha)}`
    : "none";

  const iconShadowStr = iconShadow.alpha > 0
    ? `${iconShadow.x}px ${iconShadow.y}px ${iconShadow.blur}px ${hexToRgba(iconShadow.color, iconShadow.alpha)}`
    : "none";

  const currentShadow = shadowTarget === "text" ? textShadow : shadowTarget === "icon" ? iconShadow : textShadow;

  return (
    <Animation id="cover">
      <div className="cover-page">
        {/* Preview Canvas */}
        <div className="cover-preview-container">
          <div className="cover-preview">
            <svg
              ref={svgRef}
              width={canvasWidth}
              height={canvasHeight}
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              className="cover-svg"
            >
              <defs>
                <pattern id="checkerboard" patternUnits="userSpaceOnUse" width="20" height="20">
                  <rect width="10" height="10" fill="#ccc" />
                  <rect x="10" y="10" width="10" height="10" fill="#ccc" />
                  <rect x="10" width="10" height="10" fill="#fff" />
                  <rect y="10" width="10" height="10" fill="#fff" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#checkerboard)" />
              <rect width="100%" height="100%" fill={transparentBg ? "none" : hexToRgba(bgColor, bgOpacity)} />

              {bgImage && (
                <image
                  href={bgImage}
                  x={canvasWidth / 2 - (canvasWidth * bgImageScale) / 2 + bgImageX}
                  y={canvasHeight / 2 - (canvasHeight * bgImageScale) / 2 + bgImageY}
                  width={canvasWidth * bgImageScale}
                  height={canvasHeight * bgImageScale}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ filter: `blur(${bgBlur}px)` }}
                />
              )}

              {visualRatios.map((ratio, idx) => {
                const w = canvasHeight * (ratio.w / ratio.h);
                const x = (canvasWidth - w) / 2;
                return (
                  <rect
                    key={idx}
                    className="ratio-guide"
                    x={x}
                    y={0}
                    width={w}
                    height={canvasHeight}
                    fill="none"
                    stroke="var(--accent-color)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity={visualRatios.length > 1 ? 0.5 : 0}
                  />
                );
              })}

              <foreignObject width="100%" height="100%">
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: `${gap}px`,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: iconBgEnabled ? `${iconSize + iconBgPadding * 2}px` : "auto",
                      height: iconBgEnabled ? `${iconSize + iconBgPadding * 2}px` : "auto",
                      borderRadius: iconBgEnabled ? `${iconBgRadius}%` : "0",
                      background: iconBgEnabled ? hexToRgba(iconBgColor, iconBgOpacity) : "transparent",
                      filter: iconShadowStr,
                    }}
                  >
                    {iconSvg ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: iconSvg }}
                        style={{
                          width: `${iconSize}px`,
                          height: `${iconSize}px`,
                          color: useOriginalIconColor ? undefined : iconColor,
                        }}
                      />
                    ) : (
                      <Icon icon="mdi:image" width={iconSize} height={iconSize} color={iconColor} />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: customFont ? customFontName : "system-ui",
                      fontWeight,
                      fontSize: `${fontSize}px`,
                      color: textColor,
                      textShadow: textShadowStr,
                    }}
                  >
                    <span>{leftText}</span>
                    <span>{rightText}</span>
                  </div>
                </div>
              </foreignObject>

              <rect
                className="canvas-border"
                width="100%"
                height="100%"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
            </svg>
          </div>
        </div>

        {/* Controls - Three Column Layout */}
        <div className="cover-controls">
          {/* Column 1: Content Settings */}
          <div className="control-column">
            <div className="column-header">
              <Pencil className="w-4 h-4" />
              <span>内容设置</span>
            </div>

            {/* Background Image */}
            <div className="control-section">
              <label className="control-label">背景图片</label>
              <div className="bg-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="hidden"
                />
                {bgImage ? (
                  <div className="bg-preview">
                    <img src={bgImage} alt="背景" />
                    <button onClick={() => setBgImage(null)} className="remove-bg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
                    <Upload className="w-5 h-5" />
                    <span>点击上传背景图</span>
                  </button>
                )}
              </div>
              {bgImage && (
                <>
                  <div className="slider-control">
                    <span>缩放</span>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={bgImageScale}
                      onChange={(e) => setBgImageScale(Number(e.target.value))}
                    />
                  </div>
                  <div className="slider-control">
                    <span>模糊</span>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={bgBlur}
                      onChange={(e) => setBgBlur(Number(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Text Inputs */}
            <div className="control-section">
              <label className="control-label">左侧文字</label>
              <input
                type="text"
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                className="control-input"
              />
            </div>

            <div className="control-section">
              <label className="control-label">右侧文字</label>
              <input
                type="text"
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                className="control-input"
              />
            </div>

            {/* Font Upload */}
            <div className="control-section">
              <label className="control-label">字体</label>
              <input
                ref={fontInputRef}
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFontUpload}
                className="hidden"
              />
              <button onClick={() => fontInputRef.current?.click()} className="control-btn">
                <Upload className="w-4 h-4" />
                {customFontName || "上传字体"}
              </button>
            </div>
          </div>

          {/* Column 2: Style Settings */}
          <div className="control-column">
            <div className="column-header">
              <Palette className="w-4 h-4" />
              <span>样式设置</span>
              <label className="link-checkbox">
                <input
                  type="checkbox"
                  checked={linkScale}
                  onChange={(e) => setLinkScale(e.target.checked)}
                />
                等比缩放
              </label>
            </div>

            <div className="slider-control with-value">
              <span>字体大小</span>
              <span className="value">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="200"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="control-slider"
            />

            <div className="slider-control with-value">
              <span>图标大小</span>
              <span className="value">{iconSize}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="200"
              value={iconSize}
              onChange={(e) => handleIconSizeChange(Number(e.target.value))}
              className="control-slider"
            />

            <div className="slider-control with-value">
              <span>图标圆角</span>
              <span className="value">{iconBgRadius}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={iconBgRadius}
              onChange={(e) => setIconBgRadius(Number(e.target.value))}
              className="control-slider"
            />

            <div className="slider-control with-value">
              <span>间距</span>
              <span className="value">{gap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="control-slider"
            />

            {/* Icon Selection */}
            <div className="control-section">
              <label className="control-label">图标</label>
              <div className="icon-selector">
                <span className="current-icon">{iconName}</span>
                <div className="icon-actions">
                  <input
                    ref={iconUploadRef}
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <button onClick={() => iconUploadRef.current?.click()} className="icon-action-btn">
                    <Upload className="w-3 h-3" />
                  </button>
                  <button onClick={() => setShowIconSearch(!showIconSearch)} className="icon-action-btn">
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <a
                href="https://icon-sets.iconify.design/"
                target="_blank"
                rel="noopener noreferrer"
                className="browse-link"
              >
                浏览图标库 <ExternalLink className="w-3 h-3 inline" />
              </a>

              {showIconSearch && (
                <div className="icon-search">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索图标..."
                    className="control-input"
                  />
                  {isSearching && <span className="searching">搜索中...</span>}
                  <div className="icon-grid">
                    {searchResults.map((icon) => (
                      <button key={icon} onClick={() => selectIcon(icon)} className="icon-item">
                        <Icon icon={icon} width={20} height={20} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="color-section">
              <div className="color-control">
                <span>文字颜色</span>
                <div className="color-input">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="color-text"
                  />
                </div>
              </div>
              <div className="color-control">
                <span>图标颜色</span>
                <div className="color-input">
                  <input
                    type="color"
                    value={iconColor}
                    onChange={(e) => handleIconColorChange(e.target.value)}
                    disabled={useOriginalIconColor}
                  />
                  <input
                    type="text"
                    value={iconColor}
                    onChange={(e) => handleIconColorChange(e.target.value)}
                    className="color-text"
                    disabled={useOriginalIconColor}
                  />
                </div>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useOriginalIconColor}
                  onChange={(e) => setUseOriginalIconColor(e.target.checked)}
                />
                使用原始颜色
              </label>
            </div>
          </div>

          {/* Column 3: Effects & Export */}
          <div className="control-column">
            <div className="column-header">
              <Wand2 className="w-4 h-4" />
              <span>特效与导出</span>
            </div>

            {/* Icon Background Toggle */}
            <div className="toggle-control">
              <span>图标背景</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={iconBgEnabled}
                  onChange={(e) => setIconBgEnabled(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {iconBgEnabled && (
              <div className="sub-controls">
                <div className="color-control">
                  <span>背景颜色</span>
                  <div className="color-input">
                    <input
                      type="color"
                      value={iconBgColor}
                      onChange={(e) => setIconBgColor(e.target.value)}
                    />
                    <input
                      type="text"
                      value={iconBgColor}
                      onChange={(e) => setIconBgColor(e.target.value)}
                      className="color-text"
                    />
                  </div>
                </div>
                <div className="slider-control">
                  <span>不透明度</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={iconBgOpacity}
                    onChange={(e) => setIconBgOpacity(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Shadow Settings */}
            <div className="control-section">
              <div className="shadow-header">
                <span>阴影设置</span>
                <div className="shadow-targets">
                  <button
                    onClick={() => setShadowTarget("both")}
                    className={shadowTarget === "both" ? "active" : ""}
                  >
                    <Layers className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setShadowTarget("text")}
                    className={shadowTarget === "text" ? "active" : ""}
                  >
                    T
                  </button>
                  <button
                    onClick={() => setShadowTarget("icon")}
                    className={shadowTarget === "icon" ? "active" : ""}
                  >
                    <Star className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="shadow-controls">
                <div className="input-group">
                  <span>颜色</span>
                  <div className="color-input small">
                    <input
                      type="color"
                      value={currentShadow.color}
                      onChange={(e) => updateShadow("color", e.target.value)}
                    />
                    <input
                      type="text"
                      value={currentShadow.color}
                      onChange={(e) => updateShadow("color", e.target.value)}
                      className="color-text"
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <span>模糊</span>
                    <input
                      type="number"
                      value={currentShadow.blur}
                      onChange={(e) => updateShadow("blur", Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <span>X</span>
                    <input
                      type="number"
                      value={currentShadow.x}
                      onChange={(e) => updateShadow("x", Number(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <span>Y</span>
                    <input
                      type="number"
                      value={currentShadow.y}
                      onChange={(e) => updateShadow("y", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="control-section">
              <label className="control-label">文件名</label>
              <input
                type="text"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
                className="control-input"
                placeholder="cover"
              />
            </div>

            <div className="control-section">
              <label className="control-label">格式</label>
              <div className="format-selector">
                <button
                  onClick={() => setExportFormat("png")}
                  className={exportFormat === "png" ? "active" : ""}
                >
                  PNG
                </button>
                <button
                  onClick={() => setExportFormat("svg")}
                  className={exportFormat === "svg" ? "active" : ""}
                >
                  SVG
                </button>
              </div>
            </div>

            <div className="control-section">
              <label className="control-label">缩放倍率</label>
              <div className="scale-selector">
                {[1, 2, 3, 4].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setExportScale(scale)}
                    className={exportScale === scale ? "active" : ""}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
            </div>

            <div className="toggle-control">
              <span>背景透明</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="export-info">
              {Math.round(BASE_HEIGHT * (activeRatios.find(r => r.checked)?.w || 16) / (activeRatios.find(r => r.checked)?.h || 9) * exportScale)}x{Math.round(BASE_HEIGHT * exportScale)} px
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <button onClick={resetAll} className="reset-btn">
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <button onClick={doExport} className="export-btn">
                <Download className="w-4 h-4" />
                导出图片
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cover-page {
          padding: 20px;
        }

        .cover-preview-container {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
        }

        .cover-preview {
          display: flex;
          justify-content: center;
          overflow: auto;
        }

        .cover-svg {
          max-width: 100%;
          height: auto;
          max-height: 50vh;
        }

        .cover-controls {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .control-column {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid var(--border-color);
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: var(--accent-color);
          font-weight: 600;
        }

        .column-header .link-checkbox {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: normal;
        }

        .control-section {
          margin-bottom: 16px;
        }

        .control-label {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .control-input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 14px;
        }

        .control-input:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .control-btn {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .control-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .slider-control {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .slider-control.with-value {
          margin-top: 12px;
        }

        .slider-control .value {
          color: var(--text-muted);
          font-size: 12px;
        }

        .control-slider {
          width: 100%;
          margin-bottom: 12px;
          accent-color: var(--accent-color);
        }

        .bg-upload-area {
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .upload-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
        }

        .bg-preview {
          position: relative;
        }

        .bg-preview img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .remove-bg {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-color);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .icon-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .current-icon {
          font-size: 13px;
          color: var(--text-primary);
        }

        .icon-actions {
          display: flex;
          gap: 4px;
        }

        .icon-action-btn {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .browse-link {
          display: block;
          margin-top: 8px;
          font-size: 12px;
          color: var(--accent-color);
          text-decoration: none;
        }

        .browse-link:hover {
          text-decoration: underline;
        }

        .icon-search {
          margin-top: 12px;
        }

        .searching {
          font-size: 12px;
          color: var(--text-muted);
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          margin-top: 8px;
          max-height: 120px;
          overflow-y: auto;
        }

        .icon-item {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          cursor: pointer;
        }

        .icon-item:hover {
          border-color: var(--accent-color);
        }

        .color-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .color-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .color-control span {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .color-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .color-input input[type="color"] {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .color-text {
          width: 80px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 8px;
        }

        .toggle-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .toggle-control span {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .switch {
          position: relative;
          width: 44px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--border-color);
          transition: .3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-color);
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }

        .sub-controls {
          padding-left: 12px;
          border-left: 2px solid var(--border-color);
          margin-bottom: 12px;
        }

        .shadow-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .shadow-header span {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .shadow-targets {
          display: flex;
          gap: 4px;
        }

        .shadow-targets button {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .shadow-targets button.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .shadow-controls {
          background: var(--bg-secondary);
          border-radius: 8px;
          padding: 12px;
        }

        .input-group {
          margin-bottom: 8px;
        }

        .input-group span {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .input-group input {
          width: 100%;
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 13px;
        }

        .input-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .color-input.small input[type="color"] {
          width: 24px;
          height: 24px;
        }

        .color-input.small .color-text {
          width: 60px;
        }

        .format-selector,
        .scale-selector {
          display: flex;
          gap: 8px;
        }

        .format-selector button,
        .scale-selector button {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
        }

        .format-selector button.active,
        .scale-selector button.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .export-info {
          text-align: right;
          font-size: 12px;
          color: var(--text-muted);
          margin: 12px 0;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .reset-btn,
        .export-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .reset-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .export-btn {
          background: var(--accent-color);
          color: white;
        }

        .reset-btn:hover,
        .export-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 1024px) {
          .cover-controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Animation>
  );
}
