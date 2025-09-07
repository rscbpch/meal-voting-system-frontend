import { useState, useEffect } from "react";
import {
    FiChevronLeft,
    FiChevronRight,
    FiMoreHorizontal,
} from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
    className?: string;
    disabled?: boolean;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showPrevNext = true,
    maxVisiblePages = 5,
    className = "",
    disabled = false,
}: PaginationProps) => {
    const [visiblePages, setVisiblePages] = useState<number[]>([]);

    useEffect(() => {
        const calculateVisiblePages = () => {
            if (totalPages <= maxVisiblePages) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
            }
            const half = Math.floor(maxVisiblePages / 2);
            let start = Math.max(1, currentPage - half);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);
            if (end - start + 1 < maxVisiblePages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        };
        setVisiblePages(calculateVisiblePages());
    }, [currentPage, totalPages, maxVisiblePages]);

    const handlePageClick = (page: number) => {
        if (disabled || page === currentPage) return;
        onPageChange(page);
    };

    const handlePrevious = () => {
        if (disabled || currentPage <= 1) return;
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (disabled || currentPage >= totalPages) return;
        onPageChange(currentPage + 1);
    };

    if (totalPages <= 1) return null;

    const showFirstEllipsis = visiblePages[0] > 2;
    const showLastEllipsis =
        visiblePages[visiblePages.length - 1] < totalPages - 1;

    return (
        <div
            className={`flex items-center justify-center gap-10 p-10 ${className}`}
        >
            {/* Previous Button */}
            {showPrevNext && (
                <button
                    onClick={handlePrevious}
                    disabled={disabled || currentPage === 1}
                    className="p-2 rounded-full bg-transparent hover:bg-[#E3F2B8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Go to previous page"
                >
                    <FiChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
            )}

            <div className="flex gap-4">
                {/* First Page + Ellipsis */}
                {/* Page Numbers */}
                {visiblePages[0] > 1 && (
                    <>
                        <button
                            onClick={() => handlePageClick(1)}
                            disabled={disabled}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                currentPage === 1
                                    ? "bg-[#429818] text-white"
                                    : "bg-[#F1F9D9] hover:bg-[#E3F2B8] text-gray-700"
                            }`}
                        >
                            1
                        </button>
                        {showFirstEllipsis && (
                            <span className="px-2 text-gray-500 flex items-center justofy-center">
                                <FiMoreHorizontal className="w-4 h-4" />
                            </span>
                        )}
                    </>
                )}
                {/* Visible Pages */}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        disabled={disabled}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                            page === currentPage
                                ? "bg-[#429818] text-white"
                                : "bg-[#F1F9D9] hover:bg-[#E3F2B8] text-gray-700"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                {/* Last Page + Ellipsis */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {showLastEllipsis && (
                              <span className="px-2 text-gray-500 flex items-center justofy-center">
                                <FiMoreHorizontal className="w-4 h-4" />
                            </span>
                        )}
                        <button
                            onClick={() => handlePageClick(totalPages)}
                            disabled={disabled}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                currentPage === totalPages
                                    ? "bg-[#429818] text-white"
                                    : "bg-[#F1F9D9] hover:bg-[#E3F2B8] text-gray-700"
                            }`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            {/* Next Button */}
            {showPrevNext && (
                <button
                    onClick={handleNext}
                    disabled={disabled || currentPage === totalPages}
                    className="p-2 rounded-full bg-transparent hover:bg-[#E3F2B8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <FiChevronRight className="w-4 h-4 text-gray-700" />
                </button>
            )}
        </div>
    );
};

export default Pagination;
