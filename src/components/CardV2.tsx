import { useState } from "react";
import { FiEdit2, FiTrash2, FiHeart } from "react-icons/fi";

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
    averageRating?: number;
    wishlistCount?: number;
    ranking?: number;
    totalWishlistCount?: number;
    currentVoteCount?: number;
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
    averageRating,
    wishlistCount,
    ranking,
    totalWishlistCount,
    currentVoteCount,
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
        <div className="flex  items-end h-97">
            <div className="flex  bg-white rounded-lg shadow-md overflow-visible ">
                {/* Inner container */}
                <div className="relative flex flex-col p-4 pt-34 gap-4">
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
                                  <h1 className="font-bold text-lg">{name}</h1>
                                  {isMenuManagement &&
                                      averageRating !== undefined && (
                                          <div className="flex items-center gap-1">
                                              <Star/>
                                              <span className="text-sm text-[#6B6B6B]">
                                                  {averageRating.toFixed(1)}
                                              </span>
                                          </div>
                                      )}
                              </div>
                              <p className="bg-[#F4F4F4] px-2 py-1 rounded text-xs text-[#919191]">
                                  {categoryName}
                              </p>
                          </div>
                          <div className="text-sm text-[#6B6B6B] line-clamp-3">
                              {description}
                          </div>
                        </div>
                        {/* Bottom actions */}
                        <div className="mt-auto flex justify-between items-center">
                            {/* Left info */}
                            {isMenuManagement ? (
                                <p className="text-sm text-gray-700">
                                    {wishlistCount || 0}
                                </p>
                            ) : isWishlist ? (
                                <div className="text-sm text-gray-700">
                                    <p>Ranking: #{ranking || 0}</p>
                                    <p>Total: {totalWishlistCount || 0}</p>
                                </div>
                            ) : isVote ? (
                                <p className="text-sm text-gray-700">
                                    Current votes: {currentVoteCount || 0}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-700">
                                    Votes: {votes}
                                </p>
                            )}
                            {/* Right buttons */}
                            {isMenuManagement ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                                        title="Edit"
                                        onClick={onEdit}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                                        title="Delete"
                                        onClick={onDelete}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ) : isWishlist ? (
                                <button
                                    onClick={onToggleWishlist}
                                    className="p-2 rounded-md hover:bg-gray-100 text-red-500 hover:text-red-700"
                                    title="Remove from wishlist"
                                >
                                    <FiHeart className="fill-current" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleVote}
                                    disabled={disabled}
                                    className="bg-[#429818] text-white rounded hover:bg-[#2a5b11] px-3 py-1 text-sm"
                                >
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
