// ============================================
// 友情链接类型定义
// ============================================

export interface FriendLink {
    name: string;
    description: string;
    url: string;
    avatar: string;
    addDate?: string;
    recommended?: boolean;
    disconnected?: boolean;
}

// 本站友链信息（用于申请友链时展示）
export interface FriendLinkContact {
    name: string;
    url: string;
    description: string;
    avatar: string;
    email: string;
}
