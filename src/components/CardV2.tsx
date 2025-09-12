import { useState } from "react";
import { FiHeart, FiTrash2 } from "react-icons/fi";

interface Card {
    name: string;
    categoryName: string;
    description: string;
    imgURL: string;
    initialVotes?: number;
    disabled?: boolean;
    onVote?: () => void;
    isMenuManagement?: boolean;
    isWishlist?: boolean;
    isVote?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onToggleWishlist?: () => void;
    onViewDetails?: () => void;
    averageFoodRating?: number;
    totalWishes?: number;
    totalRatingCount?: number;
    ranking?: number;
    totalWishlistCount?: number;
    currentVoteCount?: number;
    isDeleting?: boolean;
}

const FoodCard = ({
    name,
    categoryName,
    description,
    imgURL,
    initialVotes = 0,
    disabled = false,
    onVote,
    isMenuManagement = false,
    isWishlist = false,
    isVote = false,
    onEdit,
    onDelete,
    onToggleWishlist,
    onViewDetails,
    averageFoodRating,
    totalWishes,
    ranking,
    totalWishlistCount,
    currentVoteCount,
    isDeleting = false,
}: Card) => {
    const [votes, setVotes] = useState<number>(initialVotes);

    const handleVote = () => {
        if (!disabled && onVote) {
            setVotes(votes + 1);
            onVote();
        }
    };

    const Star = () => (
        <svg
            className="w-4 h-4 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    return (
        <div className="flex items-end h-100 w-69">
            <div 
                className={`flex bg-white rounded-lg shadow-md overflow-visible w-full ${onViewDetails ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : ''}`}
                onClick={onViewDetails}
            >
                {/* Inner container */}
                <div className="relative flex flex-col p-4 pt-34 gap-4 w-full">
                    {/* Floating Image */}
                    <img
                        src={imgURL}
                        alt={name}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 object-cover rounded-full shadow-xl"
                    />
                    {/* Card content */}
                    <div className="flex flex-col flex-1 gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h1 className="font-bold text-lg">
                                        {name}
                                    </h1>
                                    {isMenuManagement && (
                                        <div className="flex items-center gap-1">
                                            <Star />
                                            <span className="text-sm text-[#6B6B6B]">
                                                {averageFoodRating !== undefined && averageFoodRating !== null 
                                                    ? averageFoodRating.toFixed(1)
                                                    : 'No rating'
                                                }

                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="bg-[#F4F4F4] px-2 py-1 rounded text-xs text-[#919191]">
                                    {categoryName}
                                </p>
                            </div>
                            <div className="text-sm text-[#6B6B6B] line-clamp-3 min-h-[3.75rem]">
                                {description}
                            </div>
                        </div>
                        {/* Bottom actions */}
                        <div className="mt-auto flex justify-between items-center">
                            {/* Left info */}
                            {isMenuManagement ? (
                                <div className="flex items-center gap-2">
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13.2872 3.83325C11.8564 3.83325 10.6209 4.69775 10 5.95875C9.3791 4.69775 8.1436 3.83325 6.7128 3.83325C4.6618 3.83325 3 5.60775 3 7.79175C3 9.97575 4.2719 11.9778 5.9155 13.6223C7.5591 15.2668 10 16.8333 10 16.8333C10 16.8333 12.3618 15.2928 14.0845 13.6223C15.922 11.8413 17 9.98225 17 7.79175C17 5.60125 15.3382 3.83325 13.2872 3.83325Z"
                                            stroke="#AAD36C"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>

                                    <p className="text-sm text-gray-700">
                                        {totalWishes || 0}
                                    </p>
                                </div>
                            ) : isWishlist ? (
                                <div className="text-sm text-gray-700 flex items-center">
                                    <div className="flex items-center gap-2 pr-3 border-r border-gray-300 h-4">
                                        <svg
                                            width="22"
                                            height="31"
                                            viewBox="0 0 14 23"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7.73937 7.16312L7.22312 6.13617C7.13781 5.95785 6.87094 5.9514 6.77687 6.13617L6.26063 7.16312L5.11656 7.32425C4.91313 7.35433 4.82562 7.6014 4.97656 7.74964L5.80781 8.54457L5.61094 9.6639C5.58031 9.86371 5.79031 10.0184 5.97844 9.92601L7.00437 9.3932L8.02375 9.91742C8.21187 10.0098 8.42406 9.85511 8.39125 9.65531L8.19438 8.53597L9.02563 7.74964C9.17438 7.60355 9.08906 7.35648 8.88562 7.32425L7.74156 7.16312H7.73937ZM5.6 11.5008C5.21281 11.5008 4.9 11.808 4.9 12.1883V16.3133C4.9 16.6936 5.21281 17.0008 5.6 17.0008H8.4C8.78719 17.0008 9.1 16.6936 9.1 16.3133V12.1883C9.1 11.808 8.78719 11.5008 8.4 11.5008H5.6ZM0.7 12.8758C0.312812 12.8758 0 13.183 0 13.5633V16.3133C0 16.6936 0.312812 17.0008 0.7 17.0008H3.5C3.88719 17.0008 4.2 16.6936 4.2 16.3133V13.5633C4.2 13.183 3.88719 12.8758 3.5 12.8758H0.7ZM9.8 14.9383V16.3133C9.8 16.6936 10.1128 17.0008 10.5 17.0008H13.3C13.6872 17.0008 14 16.6936 14 16.3133V14.9383C14 14.558 13.6872 14.2508 13.3 14.2508H10.5C10.1128 14.2508 9.8 14.558 9.8 14.9383Z"
                                                fill="#D6D6D6"
                                            />
                                        </svg>
                                        <p
                                            className={`text-base font-semibold ${
                                                ranking === 1
                                                    ? "text-[#367A14]"
                                                    : ranking === 2
                                                    ? "text-[#51A927]"
                                                    : ranking === 3
                                                    ? "text-[#77C74C]"
                                                    : "text-[#676767]"
                                            }`}
                                        >
                                            {ranking || 1}
                                        </p>
                                    </div>

                                    <div className="text-[#A2A2A2] px-3">
                                        <p>
                                            {totalWishlistCount || 0}{" "}
                                            {totalWishlistCount === 1
                                                ? "like"
                                                : "likes"}
                                        </p>
                                    </div>
                                </div>
                            ) : isVote ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.46427 3.92859C6.99995 3.92859 6.54018 4.02004 6.11121 4.19773C5.68224 4.37542 5.29246 4.63585 4.96414 4.96418C4.63582 5.2925 4.37538 5.68227 4.19769 6.11124C4.02001 6.54022 3.92855 6.99999 3.92855 7.4643C3.92855 7.92862 4.02001 8.38839 4.19769 8.81736C4.37538 9.24634 4.63582 9.63611 4.96414 9.96443C5.29246 10.2928 5.68224 10.5532 6.11121 10.7309C6.54018 10.9086 6.99995 11 7.46427 11C8.402 11 9.30132 10.6275 9.9644 9.96443C10.6275 9.30136 11 8.40203 11 7.4643C11 6.52657 10.6275 5.62725 9.9644 4.96418C9.30132 4.3011 8.402 3.92859 7.46427 3.92859ZM5.10713 7.4643C5.10713 7.15476 5.1681 6.84825 5.28655 6.56226C5.40501 6.27628 5.57864 6.01643 5.79752 5.79755C6.0164 5.57867 6.27625 5.40504 6.56223 5.28659C6.84821 5.16813 7.15472 5.10716 7.46427 5.10716C7.77381 5.10716 8.08033 5.16813 8.36631 5.28659C8.65229 5.40504 8.91214 5.57867 9.13102 5.79755C9.3499 6.01643 9.52353 6.27628 9.64198 6.56226C9.76044 6.84825 9.82141 7.15476 9.82141 7.4643C9.82141 8.08946 9.57307 8.689 9.13102 9.13105C8.68897 9.5731 8.08942 9.82145 7.46427 9.82145C6.83912 9.82145 6.23957 9.5731 5.79752 9.13105C5.35547 8.689 5.10713 8.08946 5.10713 7.4643ZM15.7143 5.50002C14.9849 5.50002 14.2854 5.78975 13.7697 6.30547C13.254 6.8212 12.9643 7.52067 12.9643 8.25002C12.9643 8.97936 13.254 9.67884 13.7697 10.1946C14.2854 10.7103 14.9849 11 15.7143 11C16.4436 11 17.1431 10.7103 17.6588 10.1946C18.1745 9.67884 18.4643 8.97936 18.4643 8.25002C18.4643 7.52067 18.1745 6.8212 17.6588 6.30547C17.1431 5.78975 16.4436 5.50002 15.7143 5.50002ZM14.1428 8.25002C14.1428 7.83325 14.3084 7.43355 14.6031 7.13885C14.8978 6.84415 15.2975 6.67859 15.7143 6.67859C16.131 6.67859 16.5307 6.84415 16.8254 7.13885C17.1201 7.43355 17.2857 7.83325 17.2857 8.25002C17.2857 8.66679 17.1201 9.06648 16.8254 9.36118C16.5307 9.65588 16.131 9.82145 15.7143 9.82145C15.2975 9.82145 14.8978 9.65588 14.6031 9.36118C14.3084 9.06648 14.1428 8.66679 14.1428 8.25002ZM1.57141 14.3393C1.57141 13.8704 1.75767 13.4208 2.0892 13.0892C2.42074 12.7577 2.8704 12.5714 3.33927 12.5714H11.5893C12.0581 12.5714 12.5078 12.7577 12.8393 13.0892C13.1709 13.4208 13.3571 13.8704 13.3571 14.3393V14.7565C13.3565 14.8201 13.3521 14.8836 13.3438 14.9467C13.3261 15.1087 13.2972 15.2694 13.2573 15.4275C13.1272 15.9434 12.8956 16.4282 12.5761 16.8536C11.7794 17.9167 10.2598 18.8572 7.46427 18.8572C4.6687 18.8572 3.14913 17.9167 2.35241 16.8536C2.0332 16.4281 1.80189 15.9433 1.67198 15.4275C1.62056 15.2221 1.58769 15.0126 1.57377 14.8013L1.57141 14.7565V14.3393ZM2.74998 14.7282V14.7424L2.75705 14.8209C2.76491 14.8948 2.78063 15.0056 2.8152 15.1415C2.9068 15.5049 3.06972 15.8465 3.29448 16.1464C3.82405 16.8512 4.95627 17.6786 7.46427 17.6786C9.97227 17.6786 11.1045 16.8512 11.6333 16.1464C11.9083 15.7803 12.045 15.4142 12.1126 15.1415C12.1457 15.0106 12.1675 14.877 12.1778 14.7424L12.1786 14.7282V14.3393C12.1786 14.183 12.1165 14.0331 12.006 13.9226C11.8954 13.8121 11.7456 13.75 11.5893 13.75H3.33927C3.18298 13.75 3.03309 13.8121 2.92258 13.9226C2.81207 14.0331 2.74998 14.183 2.74998 14.3393V14.7282ZM13.4357 16.9872C14.0431 17.1734 14.7926 17.2857 15.7127 17.2857C17.8891 17.2857 19.1054 16.6603 19.7662 15.906C20.03 15.6072 20.2257 15.2547 20.3398 14.8728C20.3844 14.7185 20.4131 14.56 20.4254 14.3998L20.427 14.3629V14.3393C20.427 13.8704 20.2407 13.4208 19.9092 13.0892C19.5777 12.7577 19.128 12.5714 18.6591 12.5714H13.431C13.7406 12.8944 13.9668 13.299 14.0737 13.75H18.6599C18.8148 13.75 18.9636 13.811 19.0738 13.9198C19.1841 14.0286 19.2471 14.1765 19.2492 14.3314L19.2453 14.3676C19.2374 14.4268 19.2251 14.4854 19.2083 14.5428C19.142 14.76 19.0295 14.9602 18.8783 15.1297C18.5083 15.554 17.6628 16.1072 15.7127 16.1072C14.9733 16.1072 14.3927 16.0278 13.9362 15.9052C13.8158 16.2856 13.6476 16.6491 13.4357 16.9872Z"
                                            fill="#3A4038"
                                        />
                                    </svg>

                                    <p className="text-sm text-gray-700">
                                        {currentVoteCount || 0}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Votes: {votes}
                                </p>
                            )}
                            {/* Right buttons */}
                            {isMenuManagement ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit?.();
                                        }}
                                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600 group"
                                        title="Edit"
                                    >
                                        <svg
                                            width="22"
                                            height="23"
                                            viewBox="0 0 22 23"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-gray-600 group-hover:stroke-blue-500 transition-colors duration-300"
                                        >
                                            <path
                                                d="M13.75 5.83314L16.5 8.58314M11.9167 18.6665H19.25M4.58335 14.9998L3.66669 18.6665L7.33335 17.7498L17.9539 7.1293C18.2976 6.7855 18.4906 6.31927 18.4906 5.83314C18.4906 5.347 18.2976 4.88077 17.9539 4.53697L17.7962 4.3793C17.4524 4.03561 16.9862 3.84253 16.5 3.84253C16.0139 3.84253 15.5477 4.03561 15.2039 4.3793L4.58335 14.9998Z"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.();
                                        }}
                                        disabled={isDeleting}
                                        className={`p-2 rounded-md text-gray-600 hover:bg-gray-100 group transition-colors duration-300 ${
                                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        title={isDeleting ? "Deleting..." : "Delete"}
                                    >
                                        {isDeleting ? (
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                                        ) : (
                                            <FiTrash2
                                                size={20}
                                                className="transition-colors duration-300 group-hover:text-red-500"
                                            />
                                        )}
                                    </button>
                                </div>
                            ) : isWishlist ? (
                                <button
                                    onClick={onToggleWishlist}
                                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transform hover:scale-110 transition-all duration-500 ease-in-out"
                                    title="Add to Wishlist"
                                >
                                    <FiHeart
                                        size={18}
                                        className="transition-all duration-500 ease-in-out"
                                    />
                                </button>
                            ) : (
                                <button
                                    onClick={handleVote}
                                    disabled={disabled}
                                    className="bg-[#429818] text-white rounded-md hover:bg-[#3E7B27] px-3 py-2 text-sm font-semibold flex justify-center items-center gap-2"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.384 2.49698C7.51661 2.26757 7.73484 2.10018 7.99077 2.03156C8.24671 1.96293 8.51941 1.99869 8.749 2.13098L11 3.43098C11.2297 3.56359 11.3973 3.782 11.4659 4.03818C11.5345 4.29435 11.4986 4.5673 11.366 4.79698L10.095 6.99998H11C11.1326 6.99998 11.2598 7.05265 11.3536 7.14642C11.4473 7.24019 11.5 7.36737 11.5 7.49998C11.5 7.63258 11.4473 7.75976 11.3536 7.85353C11.2598 7.9473 11.1326 7.99998 11 7.99998H5C4.86739 7.99998 4.74021 7.9473 4.64645 7.85353C4.55268 7.75976 4.5 7.63258 4.5 7.49998C4.5 7.36737 4.55268 7.24019 4.64645 7.14642C4.74021 7.05265 4.86739 6.99998 5 6.99998H5.675C5.51067 6.84554 5.40337 6.64009 5.37052 6.41699C5.33766 6.19389 5.38118 5.96623 5.494 5.77098L7.384 2.49698ZM7.621 6.99998H8.94L10.5 4.29698L8.25 2.99698L6.36 6.27098L7.621 6.99998ZM4.515 4.99998H4.784L4.627 5.27098C4.49 5.50898 4.407 5.76298 4.375 6.01998C4.26718 6.05152 4.17313 6.11845 4.108 6.20998L2.114 8.99998H13.886L11.892 6.20998C11.8596 6.16431 11.8197 6.12442 11.774 6.09198L12.232 5.29698C12.246 5.27298 12.2593 5.24831 12.272 5.22298C12.4422 5.32772 12.5898 5.46541 12.706 5.62798L14.721 8.44798C14.902 8.70298 15 9.00798 15 9.31998V12.5C15 12.8978 14.842 13.2793 14.5607 13.5606C14.2794 13.8419 13.8978 14 13.5 14H2.5C2.10218 14 1.72064 13.8419 1.43934 13.5606C1.15804 13.2793 1 12.8978 1 12.5V9.31998C1.00035 9.00757 1.09824 8.70307 1.28 8.44898L3.294 5.62898C3.43263 5.43461 3.61564 5.27614 3.82783 5.16674C4.04003 5.05734 4.27627 5.00017 4.515 4.99998ZM14 9.99998H2V12.5C2 12.6326 2.05268 12.7598 2.14645 12.8535C2.24021 12.9473 2.36739 13 2.5 13H13.5C13.6326 13 13.7598 12.9473 13.8536 12.8535C13.9473 12.7598 14 12.6326 14 12.5V9.99998Z"
                                            fill="white"
                                        />
                                    </svg>

                                    {disabled ? "Voted" : "Vote Now"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
