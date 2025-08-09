import { useState, useEffect } from 'react';
import BayCanteenVideo from '../assets/BayCanteenAnimation.mp4';
import Annoucing from '../assets/Annoucing.png';
import AnnoucingV2 from '../assets/AnnoucingV2.png';

const Homepage = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');

    useEffect(() => {
        // const calculateTimeLeft = () => {
        //     const now = new Date();
        //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        //     const endTime = new Date(today);
        //     endTime.setDate(endTime.getDate() + 1); 
        //     endTime.setHours(0, 0, 0, 0); 

        //     const timeDiff = endTime - now;

        //     if (timeDiff <= 0) {
        //         setTimeLeft("Voting has ended");
        //         setHours('00');
        //         setMinutes('00');
        //         setSeconds('00');
        //         return;
        //     }

        //     const h = Math.floor(timeDiff / (1000 * 60 * 60));
        //     const m = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        //     const s = Math.floor((timeDiff % (1000 * 60)) / 1000);

        //     setHours(h.toString().padStart(2, '0'));
        //     setMinutes(m.toString().padStart(2, '0'));
        //     setSeconds(s.toString().padStart(2, '0'));
        // };

        // Countdown from 6 AM to 5 PM
        const calculateTimeLeft = () => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const startTime = new Date(today);
            startTime.setHours(6, 0, 0, 0);

            const endTime = new Date(today);
            endTime.setHours(17, 0, 0, 0); 

            if (now < startTime || now > endTime) {
                setTimeLeft("Vote will start again at 6:00 AM");
                setHours('00');
                setMinutes('00');
                setSeconds('00');
                return;
            }

            const timeDiff = endTime - now;

            if (timeDiff <= 0) {
                setTimeLeft("Vote will start again at 6:00 AM");
                setHours('00');
                setMinutes('00');
                setSeconds('00');
                return;
            }

            const h = Math.floor(timeDiff / (1000 * 60 * 60));
            const m = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((timeDiff % (1000 * 60)) / 1000);

            setHours(h.toString().padStart(2, '0'));
            setMinutes(m.toString().padStart(2, '0'));
            setSeconds(s.toString().padStart(2, '0'));
            setTimeLeft("");
        };

        calculateTimeLeft();

        const timer = setInterval(() => {
            calculateTimeLeft();
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <section className="py-10 my-8">
                <div className="max-w-7xl mx-auto px-16"> 
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="font-title text-[48px] font-extrabold">Your Meal, Your <span className="main-text">Choice</span></p>
                            <p className="text-[18px] font-medium leading-tight mb-6 text-[#606060]">
                                Vote daily on your preferred meals and help the canteen prepare 
                                exactly what's in demand; fresher, tastier, and waste-free.
                            </p>
                            <div>
                                <button className="main-button">
                                    Vote now
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <video
                                src={BayCanteenVideo} autoPlay 
                                loop muted controls={false}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#F1FCED] py-10 my-8">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div>
                                <img 
                                    src={AnnoucingV2}
                                    alt="Announcing"
                                    className="w-60 h-auto object-contain"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-right pr-6">
                            {timeLeft ? (
                                <div>
                                    <h2 className="text-[32px] font-bold text-[#3A4038] font-title">{timeLeft}</h2>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-[32px] font-bold text-[#3A4038] mb-4 font-title">Vote close in</h2>
                                    <div className="flex justify-end items-center space-x-4">
                                        <div className="text-center">
                                            <div className="flex space-x-2">
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{hours[0]}</span>
                                                </div>
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{hours[1]}</span>
                                                </div>
                                            </div>
                                            <p className="text-[#3A4038] text-sm mt-2 font-medium">hours</p>
                                        </div>
                                        <div className="text-[#3A4038] text-3xl pb-6">:</div>
                                        <div className="text-center">
                                            <div className="flex space-x-2">
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{minutes[0]}</span>
                                                </div>
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{minutes[1]}</span>
                                                </div>
                                            </div>
                                            <p className="text-[#3A4038] text-sm mt-2 font-medium">minutes</p>
                                        </div>
                                        <div className="text-[#3A4038] text-3xl pb-6">:</div>
                                        <div className="text-center">
                                            <div className="flex space-x-2">
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{seconds[0]}</span>
                                                </div>
                                                <div className="w-16 h-20 bg-[#3A4038] rounded-[10px] flex items-center justify-center">
                                                    <span className="text-white text-3xl font-bold">{seconds[1]}</span>
                                                </div>
                                            </div>
                                            <p className="text-[#3A4038] text-sm mt-2 font-medium">seconds</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-10 my-8">
                <div>

                </div>
            </section>
        </div>
    );
};

export default Homepage;