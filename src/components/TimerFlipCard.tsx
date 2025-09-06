import React, { useEffect, useState } from "react";

interface FlipCardProps {
    digit: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ digit }) => {
    const [prevDigit, setPrevDigit] = useState(digit);
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        if (digit !== prevDigit) {
        setFlipping(true);
        const timeout = setTimeout(() => {
            setFlipping(false);
            setPrevDigit(digit);
        }, 500); 
        return () => clearTimeout(timeout);
        }
    }, [digit, prevDigit]);

    const cardWidth = "w-[3.5rem]";
    const fullHeight = "h-[3.5rem]";
    const halfHeight = "h-[1.75rem]";
    const faceBase = "relative overflow-hidden " + halfHeight;
    const topFaceBg = "bg-[#f7f7f7] border-b border-b-[rgba(0,0,0,0.1)] rounded-tr-[0.5em] rounded-tl-[0.5em]";
    const bottomFaceBg = "bg-white rounded-br-[0.5em] rounded-bl-[0.5em]";
    const innerNumber = `absolute left-0 w-full ${fullHeight} flex items-center justify-center text-4xl leading-none select-none`;

    // Inline styles for proper 3D perspective and transform preservation — Tailwind doesn't include perspective by default
    const perspectiveStyle: React.CSSProperties = { perspective: '1000px' };

    return (
    <div style={perspectiveStyle} className={`font-semibold relative inline-flex flex-col rounded-[0.5em] shadow-md ${cardWidth} ${fullHeight} select-none`}>
            <div className={`${faceBase} ${topFaceBg} z-0`}>
                <div className={`${innerNumber} top-0`}>{prevDigit}</div>
            </div>
            <div className={`${faceBase} ${bottomFaceBg} z-0`}>
                <div className={`${innerNumber} -top-[1.75rem]`}>{prevDigit}</div>
            </div>

            {flipping && (
                <>
                    <div
                        // top flipping half: rotate from 0 to -90deg (origin bottom)
                        className={`absolute top-0 left-0 w-full ${halfHeight} ${topFaceBg} animate-flip-top origin-bottom z-20 overflow-hidden backface-hidden will-change-transform`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className={`${innerNumber} top-0`} style={{ backfaceVisibility: 'hidden' }}>{prevDigit}</div>
                    </div>

                    <div
                        // bottom flipping half: rotate from 90deg down to 0 (origin top)
                        className={`absolute bottom-0 left-0 w-full ${halfHeight} ${bottomFaceBg} animate-flip-bottom origin-top z-20 overflow-hidden backface-hidden will-change-transform`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <div className={`${innerNumber} -top-[1.75rem]`} style={{ backfaceVisibility: 'hidden' }}>{digit}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlipCard;
