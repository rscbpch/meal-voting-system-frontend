import React, { useEffect, useRef, useState } from "react";
import FlipCard from "./TimerFlipCard";

interface CountdownProps {
    hours: number;
    minutes: number;
    seconds: number;
    status: "open" | "pending" | "close" | "finalized";
}

const CountdownTimer: React.FC<CountdownProps> = ({ hours, minutes, seconds, status }) => {
    const [timeLeft, setTimeLeft] = useState(hours * 3600 + minutes * 60 + seconds);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimeLeft(hours * 3600 + minutes * 60 + seconds);
    }, [hours, minutes, seconds]);

    useEffect(() => {
        if (status === "open") {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
                }, 1000);
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status]);

    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;

    return (
        <div className="flex gap-2 md:gap-4 justify-center items-center mx-4 md:mx-0">
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(hrs /10)} />
                    <FlipCard digit={hrs % 10}/>
                </div>
                <span className="text-xs md:text-sm">Hours</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(mins /10)} />
                    <FlipCard digit={mins % 10}/>
                </div>
                <span className="text-xs md:text-sm">Minutes</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(secs /10)} />
                    <FlipCard digit={secs % 10}/>
                </div>
                <span className="text-xs md:text-sm">Seconds</span>
            </div>
        </div>
    );
}

export default CountdownTimer;