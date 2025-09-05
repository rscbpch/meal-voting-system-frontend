import React, { useEffect, useState } from "react";
import FlipCard from "./FlipCard";

interface CountdownProps {
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer: React.FC<CountdownProps> = ({ hours, minutes, seconds }) => {
    const [timeLeft, setTimeLeft] = useState(hours * 3600 + minutes * 60 + seconds);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;

    return (
        <div className="flex gap-4 justify-center items-center">
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm">Hours</span>
                <div className="flex gap-1">
                    <FlipCard digit={Math.floor(hrs /10)} />
                    <FlipCard digit={hrs % 10}/>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm">Minutes</span>
                <div className="flex gap-1">
                    <FlipCard digit={Math.floor(mins /10)} />
                    <FlipCard digit={mins % 10}/>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm">Seconds</span>
                <div className="flex gap-1">
                    <FlipCard digit={Math.floor(secs /10)} />
                    <FlipCard digit={secs % 10}/>
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;