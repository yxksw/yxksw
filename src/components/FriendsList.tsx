import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FriendCard from './FriendCard';
import type { FriendLink } from '../../public/data/friends-types';

interface FriendsListProps {
    links: FriendLink[];
}

const FriendsList: React.FC<FriendsListProps> = ({ links }) => {
    const PAGE_SIZE = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const activeLinks = links.filter(link => !link.disconnected);

    const totalPages = Math.ceil(activeLinks.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentLinks = activeLinks.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {currentLinks.map((link) => (
                    <FriendCard key={link.url} link={link} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination flex justify-center items-center gap-2 mb-20">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`pagination-btn p-2 rounded-lg border transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2 px-4">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`pagination-page w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                            ? 'active'
                                            : ''
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`pagination-btn p-2 rounded-lg border transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
            <style>{`
                .pagination-btn {
                    border-color: var(--border-color);
                    color: var(--text-secondary);
                    background: var(--bg-card);
                }
                .pagination-btn:hover:not(:disabled) {
                    background: var(--border-color);
                }
                .pagination-page {
                    color: var(--text-secondary);
                }
                .pagination-page:hover {
                    background: var(--border-color);
                }
                .pagination-page.active {
                    background: var(--accent-color);
                    color: white;
                    box-shadow: 0 4px 12px var(--shadow-color);
                    transform: scale(1.1);
                }
            `}</style>
        </>
    );
};

export default FriendsList;
