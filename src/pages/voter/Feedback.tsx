import { useEffect, useMemo, useState } from "react";
import PageTransition from "../../components/PageTransition";
import FeedbackItem from "../../components/FeedbackItem";
import Navbar from "../../components/Navbar";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import {
    createFeedback,
    fetchFeedbacks,
    type FeedbackItem as FeedbackItemType,
} from "../../services/feedbackService";

const StarInput = ({
    value,
    onChange,
    label,
}: {
    value: number;
    onChange: (v: number) => void;
    label: string;
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < value;
                    return (
                        <button
                            type="button"
                            key={i}
                            aria-label={`Rate ${i + 1} star`}
                            onClick={() => onChange(i + 1)}
                            className="focus:outline-none"
                        >
                            <svg
                                className={`w-6 h-6 ${
                                    filled ? "text-yellow-500" : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const MAX_CHARS = 250;

const Feedback = () => {
    const [items, setItems] = useState<FeedbackItemType[]>([]);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextOffset, setNextOffset] = useState<number | null>(null);

    const [canteen, setCanteen] = useState(0);
    const [system, setSystem] = useState(0);
    const [content, setContent] = useState("");

    // small screen form animation
    const [expanded, setExpanded] = useState(false);
    const openForm = () => setExpanded(true);
    const closeForm = () => setExpanded(false);

    const remaining = useMemo(
        () => Math.max(0, MAX_CHARS - content.length),
        [content.length]
    );

    const load = async (start = 0) => {
        try {
            setLoading(true);
            const res = await fetchFeedbacks(start, 10);
            setItems((prev) =>
                start === 0 ? res.items : [...prev, ...res.items]
            );
            setNextOffset(
                typeof res.nextOffset === "number" ? res.nextOffset : null
            );
        } catch (e: any) {
            setError(e.message || "Failed to load feedbacks");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        load(0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (canteen < 1 || system < 1) {
            setError("Please rate both canteen and system.");
            return;
        }
        if (!content.trim()) {
            setError("Please write your feedback.");
            return;
        }
        try {
            setPosting(true);
            await createFeedback({
                canteen,
                system,
                content: content.trim(),
            });
            setCanteen(0);
            setSystem(0);
            setContent("");
            // reload first page to include newest items if backend returns newest first
            await load(0);
        } catch (e: any) {
            setError(e.message || "Failed to submit feedback");
        } finally {
            setPosting(false);
        }
    };

    const formVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };


    return (
        <div className="min-h-screen bg-[#F6FFE8] flex flex-col">
            <Navbar />

            <PageTransition className="overflow-visible">
                <div className="max-w-6xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-14 grid grid-cols-1 md:grid-cols-2 gap-10 ">
                    {/* Desktop sticky form */}
                    <div className="hidden md:block">
                        <div className="sticky top-[72px]">
                            <div className="bg-white rounded-xl shadow p-5 border border-gray-100 w-full">
                                <h2 className="text-lg font-semibold mb-4">
                                    Leave anonymous feedback
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <StarInput
                                        label="Canteen"
                                        value={canteen}
                                        onChange={setCanteen}
                                    />
                                    <StarInput
                                        label="System"
                                        value={system}
                                        onChange={setSystem}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Content
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) =>
                                                setContent(
                                                    e.target.value.slice(
                                                        0,
                                                        MAX_CHARS
                                                    )
                                                )
                                            }
                                            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#429818] focus:border-[#429818] resize-y"
                                            placeholder="Write your feedback..."
                                            maxLength={MAX_CHARS}
                                        />
                                        <div className="text-xs text-gray-400 text-right">
                                            {remaining} characters left
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="text-sm text-red-600">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={posting}
                                        className="px-4 py-2 rounded-md bg-[#429818] text-white disabled:opacity-50"
                                    >
                                        {posting
                                            ? "Submitting..."
                                            : "Submit Feedback"}
                                    </button>
                                    <p className="text-xs text-gray-500">
                                        We do not collect your identity.
                                        Feedback is anonymous.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right column: feedback list */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Recent feedback
                            </h2>
                            {/* <button
                                onClick={() => load(0)}
                                className="text-sm text-[#3E7B27] hover:underline"
                            >
                                Refresh
                            </button> */}
                        </div>
                        {error && (
                            <div className="text-sm text-red-600">{error}</div>
                        )}
                        {items.map((it) => (
                            <FeedbackItem key={it.id} item={it} />
                        ))}
                        <div className="pt-2">
                            {nextOffset !== null && (
                                <button
                                    onClick={() => load(nextOffset || 0)}
                                    disabled={loading}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {loading ? "Loading..." : "Load more"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </PageTransition>

            {/* Mobile overlay */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        key="overlay"
                        className="fixed inset-0 z-40 md:hidden bg-black/5 backdrop-blur-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeForm}
                    />
                )}
            </AnimatePresence>

            {/* Mobile floating button */}
            <AnimatePresence>
                {!expanded && (
                    <motion.button
                        key="button"
                        onClick={openForm}
                        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#429818] text-white shadow-lg md:hidden"
                        initial={{ opacity: 0, y: 20, x: 20 }} // start slightly off-screen
                        animate={{ opacity: 1, y: 0, x: 0 }} // move into place
                        exit={{ opacity: 0, y: 20, x: 20 }} // exit animation
                        whileHover={{ scale: 1.1 }} // hover pop
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }} // spring motion
                    >
                        <MessageSquare size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Mobile slide-up form */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        key="form"
                        className="fixed inset-x-0 bottom-0 md:hidden z-50"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={formVariants}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <div className="bg-white rounded-t-2xl shadow-lg p-5 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">
                                    Leave anonymous feedback
                                </h2>
                                <button
                                    onClick={closeForm}
                                    className="text-gray-500 text-xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <StarInput
                                    label="Canteen"
                                    value={canteen}
                                    onChange={setCanteen}
                                />
                                <StarInput
                                    label="System"
                                    value={system}
                                    onChange={setSystem}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) =>
                                            setContent(
                                                e.target.value.slice(
                                                    0,
                                                    MAX_CHARS
                                                )
                                            )
                                        }
                                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#429818] focus:border-[#429818] resize-y"
                                        placeholder="Write your feedback..."
                                        maxLength={MAX_CHARS}
                                    />
                                    <div className="text-xs text-gray-400 text-right">
                                        {remaining} characters left
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={posting}
                                    className="px-4 py-2 rounded-md bg-[#429818] text-white disabled:opacity-50 w-full"
                                >
                                    {posting
                                        ? "Submitting..."
                                        : "Submit Feedback"}
                                </button>
                                <p className="text-xs text-gray-500">
                                    We do not collect your identity. Feedback is
                                    anonymous.
                                </p>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer/>
        </div>
    );
};

export default Feedback;
