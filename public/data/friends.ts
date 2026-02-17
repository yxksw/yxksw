import type { FriendLink } from './friends-types';
import config from '../../config';

// ============================================
// 友情链接配置
// ============================================

export const FRIEND_LINKS: FriendLink[] = [
    {
        name: "纸鹿摸鱼处",
        description: "纸鹿至麓不知路，支炉制露不止漉",
        url: "https://blog.zhilu.site/",
        avatar: "https://www.zhilu.site/api/avatar.png",
        addDate: "2025-09-03",
        recommended: true
    },
    {
        name: "Luxynth",
        description: "我心匪石不可转",
        url: "https://www.luxynth.cn",
        avatar: "https://www.luxynth.cn/assets/images/avatar.jpg",
        addDate: "2025-09-09",
        disconnected: true
    },
    {
        name: "鈴奈咲桜のBlog",
        description: "愛することを忘れないで",
        url: "https://blog.sakura.ink",
        avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2731443459&spec=5",
        addDate: "2025-09-09",
        recommended: true
    },
    // 在这里添加更多友链
];

// 本站友链信息（用于申请友链时展示）
export const FRIEND_LINK_CONTACT = {
    name: config.Name,
    url: config.BlogUrl || window.location.origin,
    description: config.Desc,
    avatar: config.Avatar,
    email: "your-email@example.com"  // 请修改为你的邮箱
};
