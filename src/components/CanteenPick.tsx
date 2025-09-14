import { useEffect, useState, useCallback, useRef } from "react";
import { getUpcomingResults } from "../services/resultService";
import type { UpcomingResult } from "../services/resultService";
import { getCategories, type Category } from "../services/dishService";

const CanteenPick = () => {
	const [upcoming, setUpcoming] = useState<UpcomingResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const intervalRef = useRef<number | null>(null);
	const touchStartX = useRef<number | null>(null);
	const touchDeltaX = useRef<number>(0);
	const [categories, setCategories] = useState<Category[]>([]);
	const [catError, setCatError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		getUpcomingResults()
			.then((res) => {
				setUpcoming(res);
				setLoading(false);
				setCurrentIndex(0);
			})
			.catch(() => {
				setError("Failed to fetch upcoming menu");
				setLoading(false);
			});
	}, []);

	// Fetch categories (independent from upcoming dishes)
	useEffect(() => {
		getCategories()
			.then(setCategories)
			.catch(() => setCatError("Failed to fetch categories"));
	}, []);

	const total = (upcoming?.dish && Array.isArray(upcoming.dish)) ? upcoming.dish.length : 0;

	const goPrev = useCallback(() => {
		setCurrentIndex((idx) => idx === 0 ? total - 1 : idx - 1);
	}, [total]);

	const goNext = useCallback(() => {
		setCurrentIndex((idx) => (idx + 1) % (total || 1));
	}, [total]);

	// Clear and restart auto-play interval
	const resetAutoPlay = useCallback(() => {
		if (intervalRef.current) {
			window.clearInterval(intervalRef.current);
		}
		if (total > 1) {
			intervalRef.current = window.setInterval(() => {
				setCurrentIndex((idx) => (idx + 1) % (total || 1));
			}, 3000);
		}
	}, [total]);

	// Auto-play effect
	useEffect(() => {
		resetAutoPlay();
		return () => {
			if (intervalRef.current) window.clearInterval(intervalRef.current);
		};
	}, [resetAutoPlay, total]);

	// Keyboard navigation (left/right arrows) - desktop only implicitly (still fine on mobile but buttons hidden)
	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (total <= 1) return;
			if (e.key === 'ArrowLeft') {
				goPrev();
				resetAutoPlay();
			} else if (e.key === 'ArrowRight') {
				goNext();
				resetAutoPlay();
			}
		}
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [goPrev, goNext, resetAutoPlay, total]);

	// Touch swipe handlers for mobile/tablet (sm & md). We'll attach to the card wrapper.
	const onTouchStart = (e: React.TouchEvent) => {
		if (total <= 1) return;
		touchStartX.current = e.touches[0].clientX;
		touchDeltaX.current = 0;
		if (intervalRef.current) window.clearInterval(intervalRef.current);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		if (touchStartX.current == null) return;
		const currentX = e.touches[0].clientX;
		touchDeltaX.current = currentX - touchStartX.current;
	};

	const onTouchEnd = () => {
		if (touchStartX.current == null) return;
		const threshold = 40; // px to trigger swipe
		if (touchDeltaX.current > threshold) {
			goPrev();
		} else if (touchDeltaX.current < -threshold) {
			goNext();
		}
		// reset and restart autoplay
		touchStartX.current = null;
		resetAutoPlay();
	};

	if (loading) {
		return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
	}
	if (error) {
		return <div className="text-red-500 py-10 text-center">{error}</div>;
	}
	if (!upcoming || !Array.isArray(upcoming.dish) || upcoming.dish.length === 0) {
		return <div className="py-10 text-gray-500 text-center">No upcoming menu found.</div>;
	}

	const item = upcoming.dish[currentIndex];
	// Augment dish type with optional category fields (defensive casting)
	const dish = item.Dish as typeof item.Dish & { categoryId?: string | number; categoryName?: string };
	const dishName = dish.name || "-";
	const description = dish.description || "No description available.";
	const fallbackImg = '/src/assets/LogoGreen.svg';
	const imgSrc = dish.imageURL && dish.imageURL.trim() !== "" ? dish.imageURL : fallbackImg;
	const categoryName = (dish.categoryName as string | undefined) || (
		(dish.categoryId !== undefined)
			? categories.find(c => String(c.id) === String(dish.categoryId))?.name
			: undefined
	) || "";

	return (
		<div ref={containerRef} className="w-full">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-[20px] font-bold">Upcoming Canteen Menu</h2>
		        {/* Removed header next/prev buttons */}
			</div>
			<div className="relative">
				{catError && <p className="text-xs text-red-500 mb-2">{catError}</p>}
				{/* Single card display */}
				<div
					className="border-2 border-dashed border-gray-300 rounded-lg p-1 md:p-2 flex flex-col items-center justify-center h-full transition-all touch-pan-y select-none"
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					<div className="bg-white rounded-[10px] flex flex-col items-center justify-center w-full h-fill min-h-[100px] md:min-h-[180px]">
						<div className="flex flex-col md:flex-row items-center justify-between w-full h-full p-3 md:p-6">
							<div className="flex flex-row w-full gap-4 py-4 items-center max-h-[88px] md:max-h-[140px]">
								<img
									src={imgSrc}
									alt={dishName}
									className="w-16 h-16 md:w-28 md:h-28 object-cover rounded-full border-2 border-[#E6F4D7] shadow-md"
								/>
								<div className="flex flex-col ml-3 md:ml-6 gap-1 md:gap-2 w-full sm:max-w-[210px] md:max-w-[700px]">
									<h3 className="text-[12px] md:text-[18px] lg:text-[22px] font-bold text-gray-800 max-h-[42px] md:max-h-[54px] md:max-w-[700px]">
										{dishName}
									</h3>
									{categoryName && (
										<span className="hidden md:block bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 md:text-[12px] md:px-2 md:py-1 rounded font-medium w-fit">
											{categoryName}
										</span>
									)}
									<p className="hidden md:block text-gray-500 text-[14px] max-h-[22px] max-w-[700px] truncate overflow-hidden whitespace-nowrap">
										{description}
									</p>
									<div className="flex flex-col gap-1">
										{categoryName && (
											<span className="md:hidden bg-gray-100 text-gray-600 text-[10px] px-1 py-0.5 md:text-[12px] md:px-2 md:py-1 rounded font-medium w-fit">
												{categoryName}
											</span>
										)}
										{/* <div className="flex items-center gap-2 md:hidden min-h-[20px]">
											<div className="flex items-center gap-1 pr-3 border-r border-gray-300 h-4">
												<svg 
													className="w-3 h-3 md:w-4 md:h-4" 
													viewBox="0 0 14 23" 
													fill="none" 
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M7.73937 7.16312L7.22312 6.13617C7.13781 5.95785 6.87094 5.9514 6.77687 6.13617L6.26063 7.16312L5.11656 7.32425C4.91313 7.35433 4.82562 7.6014 4.97656 7.74964L5.80781 8.54457L5.61094 9.6639C5.58031 9.86371 5.79031 10.0184 5.97844 9.92601L7.00437 9.3932L8.02375 9.91742C8.21187 10.0098 8.42406 9.85511 8.39125 9.65531L8.19438 8.53597L9.02563 7.74964C9.17438 7.60355 9.08906 7.35648 8.88562 7.32425L7.74156 7.16312H7.73937ZM5.6 11.5008C5.21281 11.5008 4.9 11.808 4.9 12.1883V16.3133C4.9 16.6936 5.21281 17.0008 5.6 17.0008H8.4C8.78719 17.0008 9.1 16.6936 9.1 16.3133V12.1883C9.1 11.808 8.78719 11.5008 8.4 11.5008H5.6ZM0.7 12.8758C0.312812 12.8758 0 13.183 0 13.5633V16.3133C0 16.6936 0.312812 17.0008 0.7 17.0008H3.5C3.88719 17.0008 4.2 16.6936 4.2 16.3133V13.5633C4.2 13.183 3.88719 12.8758 3.5 12.8758H0.7ZM9.8 14.9383V16.3133C9.8 16.6936 10.1128 17.0008 10.5 17.0008H13.3C13.6872 17.0008 14 16.6936 14 16.3133V14.9383C14 14.558 13.6872 14.2508 13.3 14.2508H10.5C10.1128 14.2508 9.8 14.558 9.8 14.9383Z" fill="#D6D6D6" />
												</svg>
												<p className="text-[12px] md:text-[16px] font-semibold text-[#367A14]">
													{ranking}
												</p>
											</div>
											<div className="flex flex-row gap-1 text-[#A2A2A2]  text-[12px] md:text-[16px] font-medium">
												<svg 
													className="w-4 h-4"
													viewBox="0 0 40 40" 
													fill="none"
												>
													<path
														d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
														fill="#A3D47C"
													/>
												</svg>
												<p>
													{wishCount.toLocaleString()} 
													{wishCount === 1 
														? "like" 
														: "likes"}
												</p>
											</div>
										</div> */}
										<p className="md:hidden text-gray-500 text-[12px] max-h-[22px] max-w-[210px] truncate overflow-hidden whitespace-nowrap">
											{description}
										</p>
									</div>
								</div>
								{/* <div className="md:hidden flex items-center justify-end ml-auto">
									<svg 
										width="40" height="40" 
										viewBox="0 0 40 40" 
										fill="none"
									>
										<path
											d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
											fill="#A3D47C"
										/>
									</svg>
								</div> */}
							</div>
							{/* <div className="hidden md:flex flex-col min-w-[140px] h-full justify-between gap-y-10">
								<div className="flex items-center justify-end">
									<svg 
										width="40" height="40" 
										viewBox="0 0 40 40" 
										fill="none"
									>
										<path
											d="M20 36s-1.45-1.32-3.6-3.13C10.2 28.13 4 22.6 4 16.5 4 11.36 8.36 7 13.5 7c2.54 0 4.99 1.19 6.5 3.09C21.51 8.19 23.96 7 26.5 7 31.64 7 36 11.36 36 16.5c0 6.1-6.2 11.63-12.4 16.37C21.45 34.68 20 36 20 36z"
											fill="#A3D47C"
										/>
									</svg>
								</div>
								<div className="flex justify-end w-full">
									<div className="flex flex-row items-center gap-2 mt-2">
										<div className="flex items-center gap-1 pr-4 border-r border-gray-300 h-4">
											<svg 
												className="w-6 h-6 lg:w-4 lg:h-4" 
												viewBox="0 0 14 23" 
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M7.73937 7.16312L7.22312 6.13617C7.13781 5.95785 6.87094 5.9514 6.77687 6.13617L6.26063 7.16312L5.11656 7.32425C4.91313 7.35433 4.82562 7.6014 4.97656 7.74964L5.80781 8.54457L5.61094 9.6639C5.58031 9.86371 5.79031 10.0184 5.97844 9.92601L7.00437 9.3932L8.02375 9.91742C8.21187 10.0098 8.42406 9.85511 8.39125 9.65531L8.19438 8.53597L9.02563 7.74964C9.17438 7.60355 9.08906 7.35648 8.88562 7.32425L7.74156 7.16312H7.73937ZM5.6 11.5008C5.21281 11.5008 4.9 11.808 4.9 12.1883V16.3133C4.9 16.6936 5.21281 17.0008 5.6 17.0008H8.4C8.78719 17.0008 9.1 16.6936 9.1 16.3133V12.1883C9.1 11.808 8.78719 11.5008 8.4 11.5008H5.6ZM0.7 12.8758C0.312812 12.8758 0 13.183 0 13.5633V16.3133C0 16.6936 0.312812 17.0008 0.7 17.0008H3.5C3.88719 17.0008 4.2 16.6936 4.2 16.3133V13.5633C4.2 13.183 3.88719 12.8758 3.5 12.8758H0.7ZM9.8 14.9383V16.3133C9.8 16.6936 10.1128 17.0008 10.5 17.0008H13.3C13.6872 17.0008 14 16.6936 14 16.3133V14.9383C14 14.558 13.6872 14.2508 13.3 14.2508H10.5C10.1128 14.2508 9.8 14.558 9.8 14.9383Z" fill="#D6D6D6" />
											</svg>
											<p className="text-[14px] lg:text-[16px] font-semibold text-[#367A14]">
												{ranking}
											</p>
										</div>
										<div className="text-[#A2A2A2] text-[14px] lg:text-[16px] font-medium pl-3">
											<p>
												{wishCount.toLocaleString()} 
												{wishCount === 1 
													? "like" 
													: "likes"}
											</p>
										</div>
									</div>
								</div>
							</div> */}
						</div>
					</div>
					</div>
					{total > 1 && (
						<div className="flex justify-center items-center mt-4 gap-2">
							{/* Left arrow */}
							<button
								aria-label="Previous dish"
								onClick={() => { goPrev(); resetAutoPlay(); }}
								className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
								disabled={total <= 1}
								style={{ marginRight: 8 }}
							>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.25 14.25L6.75 9L11.25 3.75" stroke="#429818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</button>
							{/* Dots */}
							<div className="flex gap-2">
								{upcoming.dish.map((_, i) => (
									<button
										key={i}
										className={`h-2 w-2 rounded-full ${i === currentIndex ? 'bg-[#429818]' : 'bg-gray-300'}`}
										aria-label={`Go to dish ${i + 1}`}
										onClick={() => setCurrentIndex(i)}
									/>
								))}
							</div>
							{/* Right arrow */}
							<button
								aria-label="Next dish"
								onClick={() => { goNext(); resetAutoPlay(); }}
								className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
								disabled={total <= 1}
								style={{ marginLeft: 8 }}
							>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6.75 3.75L11.25 9L6.75 14.25" stroke="#429818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</button>
						</div>
					)}
			</div>
		</div>
	);
};

export default CanteenPick;
