import type { FeedbackItem as FeedbackItemType } from "../services/feedbackService";
import {
    FaCat,
    FaDog,
    FaDragon,
    FaHippo,
    FaCrow,
    FaFrog,
    FaFish,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Star = ({ filled }: { filled: boolean }) => (
    <svg
        className={`w-4 h-4 ${filled ? "text-yellow-500" : "text-gray-300"}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const animalIcons = [FaCat, FaDog, FaDragon, FaHippo, FaCrow, FaFrog, FaFish];

const FeedbackItem = ({ item }: { item: FeedbackItemType }) => {
    const date = new Date(item.createdAt);
    const formattedDate = `${date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
    })}, ${date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // use 24-hour format; set true if you prefer 12-hour
    })}`;
    // Stable "random" index based on feedback id
    const randomIndex = item.id
        ? item.id % animalIcons.length
        : Math.floor(Math.random() * animalIcons.length);
    const AnimalIcon = animalIcons[randomIndex];

    return (
        <motion.div
            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-sm transition-shadow duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            {/* Header: Avatar + Anonymous + Date */}
            <div className="flex items-center justify-between p-3 pb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EAF6E7] flex items-center justify-center text-[#3E7B27] text-lg">
                        <AnimalIcon />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                        Anonymous
                    </span>
                </div>
                <span className="text-xs text-gray-400">
                    {formattedDate}
                </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Content: Ratings + Feedback */}
            <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    {typeof item.canteen === "number" && (
                        <div className="flex items-center gap-1 bg-green-50 rounded-full px-2 py-1">
                            <span className="text-gray-600 text-xs font-medium">
                                Canteen:
                            </span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        filled={i < (item.canteen || 0)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {typeof item.system === "number" && (
                        <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1">
                            <span className="text-gray-600 text-xs font-medium">
                                System:
                            </span>
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        filled={i < (item.system || 0)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                    {item.content}
                </p>
            </div>
        </motion.div>
    );
};

export default FeedbackItem;
