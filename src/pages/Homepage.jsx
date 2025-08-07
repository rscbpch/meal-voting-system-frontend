import { useState, useEffect } from 'react';
import BayCanteenVideo from '../assets/BayCanteenAnimation.mp4';

const Homepage = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const startTime = new Date(today);
            startTime.setHours(6, 0, 0, 0); 

            const endTime = new Date(today);
            endTime.setHours(17, 0, 0, 0); 

            if (now < startTime || now > endTime) {
                return "Voting will start at 6:00 AM";
            }

            const timeDiff = endTime - now;

            if (timeDiff <= 0) {
                return "Voting has ended";
            }

            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <section className="mt-8 mb-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 items-center">
                    <div className="w-full">
                        <p className="text-5xl font-bold mb-3">Welcome to <span className="text-[#429818]">Bay Canteen</span>!</p>
                        <p className="leading-tight mb-3">
                            Bay Canteen is a website where students can vote for their favorite meals from a list of options, 
                            helping organizers decide which meals to serve based on popular choice.
                        </p>
                        <p className="text-2xl font-semibold text-[#386641]">{timeLeft}</p>
                        <p className="-mt-1 mb-3">Until vote closes</p>
                        <div>
                            <button className="bg-[#429818] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#386641] transition-colors">
                                Vote now
                            </button>
                        </div>
                    </div>
                    <div className="w-full">
                        <video
                            src={BayCanteenVideo} autoPlay 
                            loop muted controls={false}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>
            <section className="bg-[#429818] mt-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <p className="text-white font-semibold mb-2">Why Bay Canteen?</p>
                    <div className="grid grid-cols-2 items-center gap-8">
                        <div className="bg-white rounded-2xl px-4 py-4">
                            <p>For students</p>
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-4">
                            <p>For Vendors</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;