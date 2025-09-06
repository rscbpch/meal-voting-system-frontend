import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { div, title } from "motion/react-client";

interface BannerItem {
  title: string;
  subtitle: string;
  description: string;
  imgSrc: string;
}

interface BannerProps {
  items: BannerItem[];
  autoSlideInterval?: number;
}

const Banner: React.FC<BannerProps> = ({ items, autoSlideInterval = 1800 }) => {
  const [index, setIndex] = useState(0);


  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
        handleNext();
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="p-10">
        <div className="relative h-full overflow-visible flex items-center justify-center bg-[#F7F7F7] rounded-xl">
            <div className="flex flex-row items-center justify-center h-[1/2] w-full max-w-7xl">  
                {/* --- Text side (LEFT) --- */}
                <div className="flex-1 text-left max-w-md">
                    <h1 className="text-4xl font-bold text-[#429818]">
                        {items[index].title}
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-2">
                        {items[index].subtitle}
                    </h2>
                    <p className="mt-4 text-gray-600">{items[index].description}</p>
                </div>

                {/* --- Arc Images (RIGHT) --- */}
                <div className="relative flex items-center justify-center flex-1 h-[400px]">
                    <div className="absolute w-full h-[400px] bg-[#AAD36C] rounded-b-full p-0"></div>
                        {items.map((item, i) => {
                            // spread items around an arc
                            const angle =
                            ((i - index + items.length) % items.length) *
                            (Math.PI / (items.length - 1));
                            const radius = 220;

                            const centerX = 0;
                            const centerY = 0;
                            const x = centerX + Math.cos(angle) * radius;
                            const y = centerY -Math.sin(angle) * radius;

                            const isCenter = i === index;
                            return (
                            <motion.img
                                key={i}
                                src={item.imgSrc}
                                alt={item.title}
                                className={`absolute items-center rounded-full shadow-md object-cover ${
                                isCenter
                                    ? "w-[290px] h-[290px] z-30"
                                    : "w-[136px] h-[136px] z-10"
                                }`}
                                animate={{
                                x,
                                y,
                                scale: isCenter ? 1 : 0.8,
                                opacity: isCenter ? 1 : 1,
                                }}
                                transition={{ duration: 0.6 }}
                            />
                            );
                        })}

                    {/* Up Button */}
                    <button
                        onClick={handlePrev}
                        className="absolute top-3/4 left-[5px] -translate-y-1/2 bg-[#AAD36C] p-3 rounded-full shadow-md hover:bg-[#92d36c]"
                    >
                        <ChevronUp size={28} />
                    </button>

                    {/* {/* Down Button */}
                    <button
                        onClick={handleNext}
                        className="absolute top-3/4 right-[10px] -translate-y-1/2 bg-[#AAD36C] p-3 rounded-full shadow-md hover:bg-[#92d36c]"
                    >
                        <ChevronDown size={28} />
                    </button>
                </div> 
            </div>
        </div>
    </div>
  );
};

export default Banner;
