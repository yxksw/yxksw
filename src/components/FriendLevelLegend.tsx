import React, { useState } from 'react';
import { FRIEND_LEVELS } from '../consts/friendLevels';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const FriendLevelLegend: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className="legend-container w-full rounded-xl border overflow-hidden mb-8 transition-all duration-300">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="legend-header w-full px-6 py-4 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                    <h3 className="legend-title text-lg font-bold flex items-center gap-2">
                        <Info size={20} className="legend-icon group-hover:transition-colors" />
                        友链印记说明
                    </h3>
                    <div className="legend-chevron group-hover:transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 p-6 pt-0 border-t' : 'grid-rows-[0fr] opacity-0 px-6 py-0'}`}>
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4">
                            {FRIEND_LEVELS.map((level, index) => {
                                const prevDays = index === 0 ? 0 : FRIEND_LEVELS[index - 1].days;
                                const isLast = index === FRIEND_LEVELS.length - 1;
                                const dayRange = isLast ? `${level.days}天+` : `${prevDays}-${level.days}天`;

                                return (
                                    <div key={level.level} className="legend-item flex items-center gap-2 p-2 rounded-lg border border-transparent transition-colors cursor-default">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 ${level.theme}`}>
                                            <level.Icon size={16} />
                                        </div>
                                        <div className="flex flex-col cursor-default">
                                            <span className={`text-xs font-bold ${level.theme} cursor-default`}>
                                                {level.title}
                                            </span>
                                            <span className="legend-days text-[10px] cursor-default">
                                                {dayRange}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .legend-container {
                    background: var(--bg-card);
                    border-color: var(--border-color);
                }
                .legend-header:hover {
                    background: var(--border-color);
                }
                .legend-title {
                    color: var(--text-primary);
                }
                .legend-icon {
                    color: var(--text-muted);
                }
                .legend-header:hover .legend-icon {
                    color: var(--text-secondary);
                }
                .legend-chevron {
                    color: var(--text-muted);
                }
                .legend-header:hover .legend-chevron {
                    color: var(--text-secondary);
                }
                .legend-item:hover {
                    background: var(--border-color);
                }
                .legend-days {
                    color: var(--text-muted);
                }
            `}</style>
        </>
    );
};

export default FriendLevelLegend;
