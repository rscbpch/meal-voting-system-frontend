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
    const perspectiveStyle: React.CSSProperties = { perspective: '1000px' };

    return (
        <div style={perspectiveStyle} className={`font-semibold relative inline-flex flex-col rounded-[0.5em] shadow-md ${cardWidth} ${fullHeight} select-none`}>
            <style>
                {`
                    /* Flip animation matching your CSS: 250ms durations, ease-in/out and 250ms delay for bottom */
                    @keyframes flip-top {
                        100% {
                            transform: rotateX(90deg);
                        }
                    }

                    @keyframes flip-bottom {
                        100% {
                            transform: rotateX(0deg);
                        }
                    }
                `}
            </style>
            
            <div className={`${faceBase} ${topFaceBg} z-0`}>
                <div className={`${innerNumber} top-0`}>{digit}</div>
            </div>
            <div className={`${faceBase} ${bottomFaceBg} z-0`}>
                <div className={`${innerNumber} -top-[1.75rem]`}>{prevDigit}</div>
            </div>

            {flipping && (
                <>
                    <div
                        className={`absolute top-0 left-0 w-full ${halfHeight} ${topFaceBg} origin-bottom z-20 overflow-hidden backface-hidden will-change-transform`}
                        style={{ animation: 'flip-top 250ms ease-in forwards', transformStyle: 'preserve-3d' }}
                    >
                        <div className={`${innerNumber} top-0`} style={{ backfaceVisibility: 'hidden' }}>{prevDigit}</div>
                    </div>

                    <div
                        className={`absolute bottom-0 left-0 w-full ${halfHeight} ${bottomFaceBg} origin-top z-20 overflow-hidden backface-hidden will-change-transform`}
                        style={{ animation: 'flip-bottom 250ms ease-out 250ms forwards', transformStyle: 'preserve-3d', transform: 'rotateX(90deg)' }}
                    >
                        <div className={`${innerNumber} -top-[1.75rem]`} style={{ backfaceVisibility: 'hidden' }}>{digit}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlipCard;
