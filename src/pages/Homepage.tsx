import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RankingPodium from "../components/RankingPodium";
import CountdownTimer from "../components/CountdownTimer";
import PageTransition from "../components/PageTransition";
import { API_NO_AUTH } from "../services/axios"; 
import food from "../assets/rounded-food.png";
import borito from "../assets/borito.png";
import croissant from "../assets/croissant.png";
import flatSandwich from "../assets/flat-sandwich.png";
import fries from "../assets/fries.png";
import hamburger from "../assets/hamburger.png";
import pizza from "../assets/pizza.png";
import salad from "../assets/salad.png";
import sandwich from "../assets/sandwich.png";
import steak from "../assets/steak.png";
import tacobell from "../assets/tacobell.png";
import food1 from "../assets/small-food-1.png";
import food2 from "../assets/small-food-2.png";

const Homepage = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"open" | "pending" | "close" | "finalized">("pending");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        let mounted = true;
        const fetchStatus = async () => {
            try {
                const res = await API_NO_AUTH.get("/results/today");
                if (!mounted) return;
                const data = res.data;
                if (data && typeof data.status === "string") {
                    const s = data.status as "open" | "pending" | "close" | "finalized";
                    setStatus(s);
                }
            } catch (err) {
                console.error("Failed to fetch todays's results:", err);
            }
        };
        const checkAuth = async () => {
            try {
                const user = await getProfile();
                setIsLoggedIn(!!user);
            } catch {
                setIsLoggedIn(false);
            }
        };
        fetchStatus();
        checkAuth();
        const pollId = window.setInterval(fetchStatus, 15000);
        return () => {
            mounted = false;
            clearInterval(pollId);
        };
    }, []);

    return (
        <div>
            <Navbar />
            <PageTransition>
                <main className="bg-[#F6FFE8]">
                    <div className="bg-[#f7f7f7] md:min-h-[760px] min-h-[520px] p-6 md:p-10 relative overflow-hidden flex items-center justify-center">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 relative">
                            <div className="mx-auto max-w-[620px] text-center">
                                <h1 className="title-font text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">Your Meal, Your Choice</h1>
                                <p className="mt-6 text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                                    Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand; fresher, tastier, and waste-free.
                                </p>
                                <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-6">
                                    {isLoggedIn === false ? (
                                        <button
                                            onClick={() => navigate('/sign-in')}
                                            className="cursor-pointer px-5 sm:px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                                        >
                                            Sign in to vote
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/menu')}
                                            className="cursor-pointer px-5 sm:px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                                            disabled={isLoggedIn === null}
                                        >
                                            Vote Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="md:block absolute right-[86%] top-[15%] w-[40px] md:w-[90px] rotate-[-12deg] opacity-80 z-10">
                            <img src={borito} alt="borito" />
                        </div>
                        <div className="md:block absolute left-[49%] top-[7%] w-[24px] md:w-[50px] rotate-[-12deg] opacity-80 z-10">
                            <img src={croissant} alt="croissant"/>
                        </div>
                        <div className="md:block absolute left-[32%] top-[24%] w-[32px] md:w-[70px] rotate-[10deg] opacity-80 z-10">
                            <img src={flatSandwich} alt="flat sandwich" />
                        </div>
                        <div className="md:block absolute right-[91%] top-[50%] w-[32px] md:w-[70px] rotate-[18deg] opacity-80 z-10">
                            <img src={fries} alt="fries" />
                        </div>
                        <div className="md:block absolute left-[74%] top-[78%] w-[36px] md:w-[80px] rotate-[8deg] opacity-80 z-10">
                            <img src={hamburger} alt="hamburger" />
                        </div>
                        <div className="md:block absolute left-[20%] top-[68%] w-[40px] md:w-[90px] rotate-[-8deg] opacity-80 z-10">
                            <img src={pizza} alt="pizza" />
                        </div>
                        <div className="md:block absolute left-[70%] top-[26%] w-[32px] md:w-[70px] rotate-[-8deg] opacity-80 z-10">
                            <img src={salad} alt="salad"/>
                        </div>
                        <div className="md:block absolute left-[90%] top-[10%] w-[40px] md:w-[90px] rotate-[24deg] opacity-80 z-10">
                            <img src={sandwich} alt="sandwich" />
                        </div>
                        <div className="block xl:hidden absolute left-[88%] top-[60%] w-[36px] md:w-[80px] rotate-[16deg] opacity-80 z-10">
                            <img src={steak} alt="steak" />
                        </div>
                        <div className="md:block absolute left-[42%] top-[85%] w-[24px] md:w-[60px] rotate-[-10deg] opacity-80 z-10">
                            <img src={tacobell} alt="tacobell" />
                        </div>
                        <div className="hidden xl:block absolute top-[-60px] right-[-50px] z-0 w-[470px] h-[520px]">
                            <img src={food} alt="Food" className="absolute left-1/2 -translate-x-1/2 top-4/7 z-20 w-[300px] h-auto" />
                            <svg width="425" height="681" viewBox="0 0 425 681" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <circle cx="18.5" cy="202.5" r="18.5" fill="#95D178"/>
                                <circle cx="226" cy="568" r="9" fill="#3E7E1F"/>
                                <path d="M462.647 162.133C463.817 162.421 464.986 162.709 466.153 162.997C469.909 159.215 473.95 155.451 478.298 151.736C488.408 143.099 499.021 135.725 509.794 129.19C520.568 122.654 531.044 116.773 542.865 111.985C566.931 102.238 584.791 95.3494 582.857 92.4903C581.912 91.0938 577.932 90.1721 572.981 89.4738C568.03 88.7756 562.281 88.3148 503.825 92.1202C445.368 95.9256 337.473 103.76 281.931 107.677C226.389 111.594 223.294 111.594 220.835 111.832C218.376 112.069 216.607 112.53 215.039 113.472C213.472 114.415 212.145 115.798 212.393 117.201C212.641 118.605 214.26 120.342 215.977 120.916C222.932 123.241 231.775 126.254 240.104 128.359C247.48 130.223 266.634 132.747 300.939 140.013C316.301 143.267 328.431 144.414 337.051 145.347C343.503 146.046 354.526 145.639 367.891 148.147C376.56 149.774 397.122 151.418 425.59 156.072C444.042 159.089 453.085 159.78 462.647 162.133Z" fill="url(#pattern0_1711_2073)"/>
                                <path d="M113 122.766C113.884 124.609 117.878 128.324 130.091 139.887C139.052 148.37 152.476 163.432 161.748 174.715C176.41 192.557 183.979 212.49 190.23 232.251C194.182 244.744 195.167 258.602 197.847 273.943C201.557 295.177 203.221 316.333 204.996 337.65C206.121 351.154 208.54 370.028 210.564 383.909C213.81 406.179 221.485 425.692 230.409 443.371C237.898 458.207 255.815 470.882 270.173 477.46C279.257 481.621 303.103 480.727 334.539 482.117C359.418 483.217 373.813 487.696 380.5 490.95C394.429 497.728 409.537 509.551 422.207 525.282C445.052 553.649 455.579 577.993 458.245 584.026C461.598 591.61 467.183 597.083 470.968 600.804C477.407 607.134 486.372 605.029 495.53 602.704C502.838 600.848 506.927 593.41 511.181 587.817C515.999 581.483 523.435 571.569 526.155 562.687C527.312 558.911 528.835 554.769 529.284 512.798C529.709 473.133 528.849 396.17 528.842 354.45C528.835 312.73 529.278 308.583 529.727 288.012C530.175 267.442 530.618 230.575 529.961 210.431C529.304 190.286 527.536 187.982 525.74 186.334C522.487 183.349 518.585 181.432 512.588 177.955C502.26 171.966 482.512 167.021 462.647 162.133C453.085 159.78 444.042 159.089 425.59 156.072C397.122 151.418 376.56 149.774 367.891 148.147C354.526 145.639 343.503 146.046 337.051 145.347C328.431 144.414 316.301 143.267 300.939 140.013C266.634 132.747 247.48 130.223 240.104 128.359C231.775 126.254 222.932 123.241 215.977 120.916C214.26 120.342 212.641 118.605 212.393 117.201C212.145 115.798 213.472 114.415 215.039 113.472C216.607 112.53 218.376 112.069 220.835 111.832C223.294 111.594 226.389 111.594 281.931 107.677C337.473 103.76 445.368 95.9256 503.825 92.1202C562.281 88.3148 568.03 88.7756 572.981 89.4738C577.932 90.1721 581.912 91.0938 582.857 92.4903C584.791 95.3494 566.931 102.238 542.865 111.985C531.044 116.773 520.568 122.654 509.794 129.19C499.021 135.725 488.408 143.099 478.298 151.736C458.057 169.029 444.47 187.395 435.332 203.637C425.296 221.473 422.991 240.462 422.093 260.159C421.532 272.47 422.964 289.535 424.083 300.853C425.202 312.172 426.528 317.241 429.644 343.816C432.759 370.391 437.623 418.318 439.908 443.7C442.192 469.081 441.75 470.463 440.638 470.715C439.526 470.966 437.757 470.044 424.686 441.919C411.614 413.794 387.294 358.493 369.901 313.414C352.508 268.336 342.779 235.155 337.547 216.219C329.29 186.338 326.512 174.939 323.39 168.641C321.654 165.138 319.37 162.343 317.139 161.868C310.367 160.426 315.779 176.74 318.66 196.361C321.2 213.661 325.521 245.936 328.241 263.937C333.036 295.669 339.885 315.9 343.242 330.319C344.842 337.192 344.816 342.922 343.932 346.874C343.52 348.713 341.279 349.444 339.704 349.688C338.13 349.933 336.803 349.472 335.014 349.234C333.225 348.997 331.014 348.997 330.076 348.997" stroke="#477331" stroke-width="151" stroke-linecap="round"/>
                                <path d="M462.647 149.133C463.817 149.421 464.986 149.709 466.153 149.997C469.909 146.215 473.95 142.451 478.298 138.736C488.408 130.099 499.021 122.725 509.794 116.19C520.568 109.654 531.044 103.773 542.865 98.9852C566.931 89.2377 584.791 82.3494 582.857 79.4903C581.912 78.0938 577.932 77.1721 572.981 76.4738C568.03 75.7756 562.281 75.3148 503.825 79.1202C445.368 82.9256 337.473 90.7599 281.931 94.677C226.389 98.5942 223.294 98.5942 220.835 98.8316C218.376 99.069 216.607 99.5298 215.039 100.472C213.472 101.415 212.145 102.798 212.393 104.201C212.641 105.605 214.26 107.342 215.977 107.916C222.932 110.241 231.775 113.254 240.104 115.359C247.48 117.223 266.634 119.747 300.939 127.013C316.301 130.267 328.431 131.414 337.051 132.347C343.503 133.046 354.526 132.639 367.891 135.147C376.56 136.774 397.122 138.418 425.59 143.072C444.042 146.089 453.085 146.78 462.647 149.133Z" fill="url(#pattern1_1711_2073)"/>
                                <path d="M113 109.766C113.884 111.609 117.878 115.324 130.091 126.887C139.052 135.37 152.476 150.432 161.748 161.715C176.41 179.557 183.979 199.49 190.23 219.251C194.182 231.744 195.167 245.602 197.847 260.943C201.557 282.177 203.221 303.333 204.996 324.65C206.121 338.154 208.54 357.028 210.564 370.909C213.81 393.179 221.485 412.692 230.409 430.371C237.898 445.207 255.815 457.882 270.173 464.46C279.257 468.621 303.103 467.727 334.539 469.117C359.418 470.217 373.813 474.696 380.5 477.95C394.429 484.728 409.537 496.551 422.207 512.282C445.052 540.649 455.579 564.993 458.245 571.026C461.598 578.61 467.183 584.083 470.968 587.804C477.407 594.134 486.372 592.029 495.53 589.704C502.838 587.848 506.927 580.41 511.181 574.817C515.999 568.483 523.435 558.569 526.155 549.687C527.312 545.911 528.835 541.769 529.284 499.798C529.709 460.133 528.849 383.17 528.842 341.45C528.835 299.73 529.278 295.583 529.727 275.012C530.175 254.442 530.618 217.575 529.961 197.431C529.304 177.286 527.536 174.982 525.74 173.334C522.487 170.349 518.585 168.432 512.588 164.955C502.26 158.966 482.512 154.021 462.647 149.133C453.085 146.78 444.042 146.089 425.59 143.072C397.122 138.418 376.56 136.774 367.891 135.147C354.526 132.639 343.503 133.046 337.051 132.347C328.431 131.414 316.301 130.267 300.939 127.013C266.634 119.747 247.48 117.223 240.104 115.359C231.775 113.254 222.932 110.241 215.977 107.916C214.26 107.342 212.641 105.605 212.393 104.201C212.145 102.798 213.472 101.415 215.039 100.472C216.607 99.5298 218.376 99.069 220.835 98.8316C223.294 98.5942 226.389 98.5942 281.931 94.677C337.473 90.7599 445.368 82.9256 503.825 79.1202C562.281 75.3148 568.03 75.7756 572.981 76.4738C577.932 77.1721 581.912 78.0938 582.857 79.4903C584.791 82.3494 566.931 89.2377 542.865 98.9852C531.044 103.773 520.568 109.654 509.794 116.19C499.021 122.725 488.408 130.099 478.298 138.736C458.057 156.029 444.47 174.395 435.332 190.637C425.296 208.473 422.991 227.462 422.093 247.159C421.532 259.47 422.964 276.535 424.083 287.853C425.202 299.172 426.528 304.241 429.644 330.816C432.759 357.391 437.623 405.318 439.908 430.7C442.192 456.081 441.75 457.463 440.638 457.715C439.526 457.966 437.757 457.044 424.686 428.919C411.614 400.794 387.294 345.493 369.901 300.414C352.508 255.336 342.779 222.155 337.547 203.219C329.29 173.338 326.512 161.939 323.39 155.641C321.654 152.138 319.37 149.343 317.139 148.868C310.367 147.426 315.779 163.74 318.66 183.361C321.2 200.661 325.521 232.936 328.241 250.937C333.036 282.669 339.885 302.9 343.242 317.319C344.842 324.192 344.816 329.922 343.932 333.874C343.52 335.713 341.279 336.444 339.704 336.688C338.13 336.933 336.803 336.472 335.014 336.234C333.225 335.997 331.014 335.997 330.076 335.997" stroke="#9AD345" stroke-width="151" stroke-linecap="round"/>
                                <defs>
                                    <pattern id="pattern0_1711_2073" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_1711_2073" transform="matrix(0.00210389 0 0 0.00209784 -0.486033 -0.440072)"/>
                                    </pattern>
                                    <pattern id="pattern1_1711_2073" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_1711_2073" transform="matrix(0.00210389 0 0 0.00209784 -0.486033 -0.440072)"/>
                                    </pattern>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div className="relative flex justify-center px-12 py-20 lg:text-[20px] mt-8">
                        <div className="absolute inset-x-0 top-6 z-20 flex justify-center">
                            {status === 'open' ? (
                                <div>
                                    <p className="font-bold text-center mb-2">Vote close in</p>
                                    <CountdownTimer />
                                </div>
                            ) : (
                                <div>
                                    <p className="text-center font-semibold">Voting has closed.</p>
                                    <p className="text-center text-[14px] md:text-[16px]">Vote will start again at 6am.</p>
                                </div>
                            )}
                        </div>
                        <div>
                            {status === 'open' ? (
                                <>
                                    <div className="absolute left-[6%] top-[23%] md:left-[20%] md:top-[14%] w-[48px] md:w-[64px] lg:w-[100px] rotate-[-12deg] opacity-90 z-30 pointer-events-none">
                                        <img src={food1} alt="food1" className="w-full h-auto" />
                                    </div>
                                    <div className="absolute right-[6%] bottom-[18%] md:right-[20%] md:bottom-[10%] w-[48px] md:w-[64px] lg:w-[100px] rotate-[-12deg] opacity-90 z-30 pointer-events-none">
                                        <img src={food2} alt="food2" className="w-full h-auto" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <style>
                                        {`
                                            @keyframes wave {
                                                0%   { transform: translateY(0); opacity: 0.95; }
                                                50%  { transform: translateY(-10px); opacity: 1; }
                                                100% { transform: translateY(0); opacity: 0.95; }
                                            }
                                        `}
                                    </style>

                                    <div className="inset-0 flex justify-center mt-2 items-center pointer-events-none z-10">
                                        <div className="flex items-end">
                                            <img
                                                src={food1}
                                                alt="food1"
                                                className="w-12 md:w-16 lg:w-20"
                                                style={{ animation: 'wave 1.1s ease-in-out infinite', animationDelay: '0s' }}
                                            />
                                            <img
                                                src={food2}
                                                alt="food2"
                                                className="w-14 md:w-18 lg:w-20"
                                                style={{ animation: 'wave 1.1s ease-in-out infinite', animationDelay: '0.12s' }}
                                            />
                                            <img
                                                src={food1}
                                                alt="food1-2"
                                                className="w-12 md:w-16 lg:w-20"
                                                style={{ animation: 'wave 1.1s ease-in-out infinite', animationDelay: '0.24s' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={`flex flex-col justify-center ${status === 'open' ? 'py-12' : 'pt-0 pb-12'}`}>
                        <p className="title-font font-semibold text-[32px] text-center">Today's top vote</p>
                        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
                            <RankingPodium />
                        </div>
                    </div>
                </main>
            </PageTransition>
            <Footer />
        </div>
    );
};

export default Homepage;