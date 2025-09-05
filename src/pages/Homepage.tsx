import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <main>
                <div className="bg-[#96d39b] md:min-h-[710px] h-[500px] p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 relative">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="title-font text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Your Meal, Your Choice</h1>
                            <p className="mt-6 text-base md:text-lg leading-7 md:leading-8 ">
                                Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand; fresher, tastier, and waste-free.
                            </p>
                            <div className="mt-8 md:mt-10 flex items-center justify-center gap-x-6">
                                <button 
                                    onClick={() => navigate('/menu')}
                                    className="cursor-pointer px-5 sm:px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                                >
                                    Vote Now
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block absolute left-[9%] top-[15%] w-[90px] rotate-[-12deg] opacity-80 z-0">
                        <img src={borito} alt="borito" />
                    </div>
                    <div className="hidden md:block absolute left-[9%] top-[15%] w-[90px] rotate-[-12deg] opacity-80 z-0">
                        <img src={croissant} alt="croissant"/>
                    </div>
                    <div className="hidden md:block absolute left-[38%] top-[24%] w-[80px] rotate-[10deg] opacity-80 z-0">
                        <img src={flatSandwich} alt="flat sandwich" />
                    </div>
                    <div className="hidden md:block absolute left-[4%] top-[50%] w-[70px] rotate-[18deg] opacity-80 z-0">
                        <img src={fries} alt="fries" />
                    </div>
                    <div className="hidden md:block absolute left-[70%] top-[81%] w-[80px] rotate-[8deg] opacity-80 z-0">
                        <img src={hamburger} alt="hamburger" />
                    </div>
                    <div className="hidden md:block absolute left-[22%] top-[65%] w-[90px] rotate-[-8deg] opacity-80 z-0">
                        <img src={pizza} alt="pizza" />
                    </div>
                    <div className="hidden md:block absolute left-[68%] top-[20%] w-[70px] rotate-[-8deg] opacity-80 z-0">
                        <img src={salad} alt="salad"/>
                    </div>
                    <div className="hidden md:block absolute left-[90%] top-[10%] w-[90px] rotate-[24deg] opacity-80 z-0">
                        <img src={sandwich} alt="sandwich" />
                    </div>
                    <div className="hidden md:block absolute left-[88%] top-[60%] w-[70px] rotate-[-16deg] opacity-80 z-0">
                        <img src={steak} alt="steak" />
                    </div>
                    <div className="hidden md:block absolute left-[75%] top-[35%] w-[60px] rotate-[0deg] opacity-80 z-0">
                        <img src={tacobell} alt="tacobell" />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;
