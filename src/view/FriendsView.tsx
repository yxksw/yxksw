import Animation from "../components/Animation";
import FriendLevelLegend from "../components/FriendLevelLegend";
import FriendsList from "../components/FriendsList";
import DisconnectedFriendsList from "../components/DisconnectedFriendsList";
import SiteInfo from "../components/SiteInfo";
import ErrorBoundary from "../components/ErrorBoundary";
import { FRIEND_LINKS, FRIEND_LINK_CONTACT } from "../../public/data/friends";
import { Link2, Mail } from "lucide-react";

export default function FriendsView() {
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

                {/* Legend */}
                <ErrorBoundary>
                    <FriendLevelLegend />
                </ErrorBoundary>

                {/* Friends List with Pagination */}
                <ErrorBoundary>
                    <FriendsList links={FRIEND_LINKS} />
                </ErrorBoundary>

                {/* Disconnected Friends List */}
                <ErrorBoundary>
                    <DisconnectedFriendsList links={FRIEND_LINKS} />
                </ErrorBoundary>

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
                            评论区留言或请发送邮件至 <a href={`mailto:${FRIEND_LINK_CONTACT.email}`} className="text-slate-800 hover:underline font-medium">{FRIEND_LINK_CONTACT.email}</a>
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
                            name={FRIEND_LINK_CONTACT.name}
                            url={FRIEND_LINK_CONTACT.url}
                            description={FRIEND_LINK_CONTACT.description}
                            avatar={FRIEND_LINK_CONTACT.avatar}
                        />
                    </ErrorBoundary>
                </div>
            </div>
        </Animation>
    );
}
