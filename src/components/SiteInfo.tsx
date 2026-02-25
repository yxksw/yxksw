import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface SiteInfoProps {
    name: string;
    url: string;
    description: string;
    avatar: string;
}

const SiteInfo: React.FC<SiteInfoProps> = ({ name, url, description, avatar }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleCopyJSON = () => {
        const data = {
            name,
            url,
            description,
            avatar
        };
        handleCopy(JSON.stringify(data, null, 2), 'json');
    };

    const InfoRow = ({ label, value, fieldId }: { label: string; value: string; fieldId: string }) => (
        <div className="site-info-row group flex items-center rounded px-2 py-1 -mx-2 transition-colors">
            <span className="site-info-label w-16 text-sm">{label}</span>
            <span className="site-info-value font-medium text-sm flex-1 truncate">{value}</span>
            <button
                onClick={() => handleCopy(value, fieldId)}
                className={`site-info-copy ml-2 p-1 rounded transition-all ${copiedField === fieldId
                        ? 'copied'
                        : ''
                    }`}
                title="复制"
            >
                {copiedField === fieldId ? <Check size={14} /> : <Copy size={14} />}
            </button>
        </div>
    );

    return (
        <>
            <div className="site-info-card rounded-2xl border p-6">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-bold">本站信息</h3>
                    <button
                        onClick={handleCopyJSON}
                        className={`site-info-json ml-auto text-xs px-2 py-1 rounded transition-colors ${copiedField === 'json'
                                ? 'copied'
                                : ''
                            }`}
                    >
                        {copiedField === 'json' ? '已复制' : 'JSON'}
                    </button>
                </div>
                <div className="space-y-1">
                    <InfoRow label="名称" value={name} fieldId="name" />
                    <InfoRow label="地址" value={url} fieldId="url" />
                    <InfoRow label="描述" value={description} fieldId="description" />
                    <InfoRow label="头像" value={avatar} fieldId="avatar" />
                </div>
            </div>
            <style>{`
                .site-info-card {
                    background: var(--bg-card);
                    border-color: var(--border-color);
                }
                .site-info-card h3 {
                    color: var(--text-primary);
                }
                .site-info-row:hover {
                    background: var(--border-color);
                }
                .site-info-label {
                    color: var(--text-muted);
                }
                .site-info-value {
                    color: var(--text-primary);
                }
                .site-info-copy {
                    color: var(--text-muted);
                    opacity: 0;
                }
                .site-info-row:hover .site-info-copy {
                    opacity: 1;
                }
                .site-info-copy:hover {
                    color: var(--text-primary);
                }
                .site-info-copy.copied {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    opacity: 1;
                }
                .site-info-json {
                    background: var(--border-color);
                    color: var(--text-secondary);
                }
                .site-info-json:hover {
                    background: var(--accent-color);
                    color: white;
                }
                .site-info-json.copied {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }
            `}</style>
        </>
    );
};

export default SiteInfo;
