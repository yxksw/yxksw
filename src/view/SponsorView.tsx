import { useState, useEffect } from "react";
import Animation from "../components/Animation";
import { Heart, Loader2, ExternalLink } from "lucide-react";

// 赞助者数据接口
interface Sponsor {
  name: string;
  avatar: string;
  website: string;
  date: string;
  amount: string;
}

// 图片资源
const WECHAT_QR = "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/weixin.avif";
const ALIPAY_QR = "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/zhifubao.avif";
const THANKYOU_IMG = "https://cdn.jsdmirror.com/gh/zsxcoder/github-img@main/img/thankyou.avif";
const SPONSORS_URL = "https://friends.152531.xyz/data/sponsors.json";

export default function SponsorView() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const response = await fetch(SPONSORS_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Sponsor[] = await response.json();
        setSponsors(data);
      } catch (err: any) {
        console.error("获取赞助者失败:", err);
        setError(err.message || "获取赞助数据失败");
        
        // 尝试使用本地缓存
        const cached = localStorage.getItem("sponsors-cache");
        if (cached) {
          try {
            setSponsors(JSON.parse(cached));
            setError("已显示缓存数据");
          } catch {
            // 忽略缓存错误
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // 缓存赞助数据
  useEffect(() => {
    if (sponsors.length > 0) {
      localStorage.setItem("sponsors-cache", JSON.stringify(sponsors));
    }
  }, [sponsors]);

  // 计算总金额
  const totalAmount = sponsors.reduce((sum, sponsor) => {
    const amount = parseFloat(sponsor.amount.replace(/[^\d.]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <Animation id="sponsor">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">赞助支持</h1>
          </div>
          <p className="text-lg text-slate-600">
            感谢每一位支持我的朋友，你们的鼓励是我持续创作的动力！
          </p>
        </div>

        {/* 感谢图片 */}
        <div className="flex justify-center mb-12">
          <img 
            src={THANKYOU_IMG} 
            alt="Thank You" 
            className="max-w-md w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* 二维码区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4">微信支付</h3>
            <img 
              src={WECHAT_QR} 
              alt="微信支付二维码" 
              className="w-48 h-48 mx-auto rounded-xl"
            />
            <p className="text-sm text-slate-500 mt-4">打开微信扫一扫</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4">支付宝</h3>
            <img 
              src={ALIPAY_QR} 
              alt="支付宝二维码" 
              className="w-48 h-48 mx-auto rounded-xl"
            />
            <p className="text-sm text-slate-500 mt-4">打开支付宝扫一扫</p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 p-6 mb-12 text-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-red-500">{sponsors.length}</p>
              <p className="text-sm text-slate-600">赞助人数</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">¥{totalAmount.toFixed(2)}</p>
              <p className="text-sm text-slate-600">累计金额</p>
            </div>
          </div>
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
            <span className="ml-2 text-slate-500">加载赞助者数据中...</span>
          </div>
        ) : (
          <>
            {/* 赞助者列表 */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">赞助者名单</h2>
            
            {sponsors.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>暂无赞助记录</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((sponsor, index) => (
                  <a
                    key={index}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-red-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={sponsor.avatar}
                        alt={sponsor.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 group-hover:border-red-200 transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 truncate">{sponsor.name}</h3>
                          <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-red-500 font-medium">{sponsor.amount}</p>
                        <p className="text-xs text-slate-400">{sponsor.date}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* 底部感谢语 */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            每一份支持都让我倍感温暖，感谢你们的信任与鼓励！
          </p>
          <p className="text-sm text-slate-400 mt-2">
            赞助记录每日更新，如有遗漏请<a href="mailto:yxksw@foxmail.com" className="text-slate-600 hover:text-red-500 hover:underline transition-colors">联系我</a>
          </p>
        </div>
      </div>
    </Animation>
  );
}
