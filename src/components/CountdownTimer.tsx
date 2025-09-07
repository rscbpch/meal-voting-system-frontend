import React, { useEffect, useRef, useState } from "react";
import FlipCard from "./TimerFlipCard";

const CountdownTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);

    const getTodayTimestamp = (hour: number, minute = 0) => {
        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        return d.getTime();
    };

    const update = () => {
        const now = Date.now();
        const start = getTodayTimestamp(6, 0); 
        const end = getTodayTimestamp(16, 0); 

        if (now >= start && now < end) {
            const secs = Math.max(Math.ceil((end - now) / 1000), 0);
            setTimeLeft(secs);
            return true;
        }

        setTimeLeft(0);
        return false;
    };

    useEffect(() => {
        update();
    
        intervalRef.current = window.setInterval(() => {
            const stillInWindow = update();
            if (!stillInWindow && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;

    return (
        <div className="flex gap-none md:gap-4 justify-center items-center mx-4 md:mx-0 px-4 md:px-0">
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5 md:gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(hrs /10)} />
                    <FlipCard digit={hrs % 10}/>
                </div>
                <span className="text-xs md:text-sm">Hours</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5 md:gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(mins /10)} />
                    <FlipCard digit={mins % 10}/>
                </div>
                <span className="text-xs md:text-sm">Minutes</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5 md:gap-1 transform scale-75 md:scale-100">
                    <FlipCard digit={Math.floor(secs /10)} />
                    <FlipCard digit={secs % 10}/>
                </div>
                <span className="text-xs md:text-sm">Seconds</span>
            </div>
        </div>
    );
}

export default CountdownTimer;