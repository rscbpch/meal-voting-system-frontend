import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";
import { 
    FiUsers, 
    FiTarget, 
  FiHeart
} from "react-icons/fi";
import { FaLeaf, FaUtensils } from "react-icons/fa";
import LogoWhite from "../assets/LogoWhite-removebg.svg";
import borito from "../assets/borito.png";
import croissant from "../assets/croissant.png";
import pizza from "../assets/pizza.png";
import hamburger from "../assets/hamburger.png";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    };

    const staggerChildren = {
        animate: {
            transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const navigate = useNavigate();

    const stats = [
     { 
       title: "Limited Variety", 
       description: "Students face repetitive meals with few options to choose from.",
       icon: FaUtensils 
     },
     { 
       title: "Inconsistent Quality", 
       description: "Meal taste and preparation don't always meet expectations.",
       icon: FiHeart 
     },
     { 
       title: "Misaligned Choices", 
       description: "Students' food preferences aren't reflected in what's served.",
       icon: FiTarget 
     },
     { 
       title: "Food Waste", 
       description: "Meals are often under-consumed, leading to unnecessary waste.",
       icon: FaLeaf 
     },
    ];

    const values = [
        {
      icon: FaUtensils,
      title: "Choice",
      description:
        "Every student and teacher deserves a say in what’s on their plate.",
    },
    {
      icon: FiTarget,
      title: " Efficiency",
      description:
        "Helping the canteen prepare the right meals, accurately every day.",
        },
        {
            icon: FiUsers,
            title: "Community",
      description:
        "Making every dining experience shared, fun, and engaging.",
        },
        {
            icon: FaLeaf,
            title: "Sustainability",
      description:
        "Cutting food waste by matching meals to actual demand.",
    },
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description:
        "Passionate about sustainable food systems and community engagement.",
        },
        {
            name: "Michael Chen",
            role: "Head of Technology",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description:
        "Tech enthusiast dedicated to creating seamless user experiences.",
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description:
        "Operations expert ensuring smooth daily operations and quality control.",
    },
    ];

    return (
        <div className="min-h-screen bg-[#F6FFE8]">
            <Navbar />
            <PageTransition>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-[#F6FFE8] via-[#E8F5E8] to-[#D4F1D4] py-20 lg:py-32 overflow-hidden">
          <style
            dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes gentleFloat {
                                0%, 100% {
                                    transform: translateY(0px);
                                }
                                50% {
                                    transform: translateY(-15px);
                                }
                            }
                            .food-float {
                                animation: gentleFloat 4s ease-in-out infinite;
                            }
                        `,
            }}
          />
                    <div className="absolute inset-0">
                        {/* Floating food elements */}
                        <div 
                            className="absolute left-[5%] top-[10%] w-12 h-12 md:w-20 md:h-20 opacity-60 food-float"
                            style={{ 
                transform: "rotate(-15deg)",
                animationDelay: "0s",
                            }}
                        >
                            <img src={borito} alt="borito" className="w-full h-full" />
                        </div>
                        <div 
                            className="absolute right-[8%] top-[15%] w-10 h-10 md:w-16 md:h-16 opacity-60 food-float"
                            style={{ 
                transform: "rotate(20deg)",
                animationDelay: "1s",
                            }}
                        >
                            <img src={croissant} alt="croissant" className="w-full h-full" />
                        </div>
                        <div 
                            className="absolute left-[15%] bottom-[20%] w-14 h-14 md:w-24 md:h-24 opacity-60 food-float"
                            style={{ 
                transform: "rotate(-10deg)",
                animationDelay: "2s",
                            }}
                        >
                            <img src={pizza} alt="pizza" className="w-full h-full" />
                        </div>
                        <div 
                            className="absolute right-[12%] bottom-[25%] w-11 h-11 md:w-18 md:h-18 opacity-60 food-float"
                            style={{ 
                transform: "rotate(15deg)",
                animationDelay: "3s",
                            }}
                        >
                            <img src={hamburger} alt="hamburger" className="w-full h-full" />
                        </div>
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex justify-center mb-8">
                <img
                  src={LogoWhite}
                  alt="Logo"
                  className="w-20 h-20 md:w-26 md:h-26"
                />
                            </div>
                            <h1 className="title-font text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D5016] mb-6">
                About{" "}
                <span className="text-[#429818] khmer-font !font-extralight">
                  បាយ
                </span>
                -Canteen
                            </h1>
               <p className="text-base sm:text-lg md:text-xl text-[#3A4038] max-w-3xl mx-auto leading-relaxed">
                 Your voice matters, even at lunch! With our system, students and
                 teachers can easily vote for their favorite meals in advance.
                 The canteen then serves food people actually love, making
                 lunchtimes tastier, smarter, and waste-free.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="grid md:grid-cols-2 gap-12 items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div>
                 <h2 className="title-font text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-6">
                                    Our Mission
                                </h2>
                 <p className="text-base sm:text-lg text-[#3A4038] mb-6 leading-relaxed">
                   To transform campus dining by giving students a voice in their
                   meal choices, reducing food waste, and creating a more
                   sustainable and satisfying dining experience for everyone.
                                </p>
                                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#429818] rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiTarget className="text-white text-sm" />
                                        </div>
                    <p className="text-[#3A4038]">
                      Democratize meal selection through daily voting
                    </p>
                                    </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#429818] rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaLeaf className="text-white text-sm" />
                                        </div>
                    <p className="text-[#3A4038]">
                      Minimize food waste through demand-based preparation
                    </p>
                                    </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#429818] rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiUsers className="text-white text-sm" />
                                        </div>
                    <p className="text-[#3A4038]">
                      Build a stronger campus community through shared dining
                      experiences
                    </p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                 <div className="bg-gradient-to-br from-[#429818] to-[#3E7B27] rounded-2xl p-6 sm:p-8 text-white">
                   <h3 className="title-font text-xl sm:text-2xl font-bold mb-4">
                     Our Vision
                   </h3>
                   <p className="text-base sm:text-lg leading-relaxed">
                     To become the leading platform for sustainable campus
                     dining, where every meal is a result of community choice and
                     every student feels heard and satisfied.
                                    </p>
                                </div>
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F6FFE8] rounded-full flex items-center justify-center">
                                    <FaUtensils className="text-[#429818] text-3xl" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-[#F6FFE8]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
               <h2 className="title-font text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                 The Problem We Solve
               </h2>
               <p className="text-base sm:text-lg text-[#3A4038] max-w-2xl mx-auto">
                 Key problems identified in our campus dining survey
               </p>
                        </motion.div>
                        
             <motion.div
               className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
               variants={staggerChildren}
               initial="initial"
               animate="animate"
             >
               {stats.map((stat, index) => (
                 <motion.div
                   key={index}
                   className="text-center"
                   variants={fadeInUp}
                 >
                   <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#429818] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                       <stat.icon className="text-white text-sm sm:text-base md:text-2xl" />
                     </div>
                     <h3 className="title-font text-sm sm:text-base md:text-xl font-bold text-[#2D5016] mb-2 sm:mb-3 text-center">
                       {stat.title}
                     </h3>
                     <p className="text-[#3A4038] text-xs sm:text-sm leading-relaxed text-center flex-grow">
                       {stat.description}
                     </p>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
               <h2 className="title-font text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
                 Our Values
               </h2>
               <p className="text-base sm:text-lg text-[#3A4038] max-w-2xl mx-auto">
                 The principles that guide everything we do
               </p>
                        </motion.div>
                        
                        <motion.div 
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                            variants={staggerChildren}
                            initial="initial"
                            animate="animate"
                        >
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center group"
                                    variants={fadeInUp}
                                >
                   <div className="bg-[#F6FFE8] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                        <div className="w-16 h-16 bg-[#429818] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <value.icon className="text-white text-2xl" />
                                        </div>
                                        <h3 className="title-font text-xl font-bold text-[#2D5016] mb-4">
                                            {value.title}
                                        </h3>
                    <p className="text-[#3A4038] leading-relaxed flex-grow">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

         {/* Call to Action Section */}
         <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
               className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
             >
               <div className="inline-flex items-center justify-center w-16 h-16 bg-[#429818] rounded-2xl mb-8 shadow-lg">
                 <FaUtensils className="text-white text-2xl" />
               </div>
               
               <h2 className="title-font text-2xl sm:text-3xl md:text-5xl font-bold text-[#2D5016] mb-6">
                 Ready to Transform Campus Dining?
                            </h2>
               
               <p className="text-base sm:text-lg md:text-xl text-[#3A4038] mb-12 max-w-3xl mx-auto leading-relaxed">
                 Join the movement that's revolutionizing how students and teachers 
                 choose their meals. Your vote shapes the future of campus dining.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                 <button 
                   onClick={() => {
                     navigate("/menu");
                   }}
                   className="group bg-[#429818] text-white w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:bg-[#3E7B27] hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 sm:gap-3"
                 >
                   <span>Start Voting</span>
                   <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                   </svg>
                 </button>
                 
                 <button 
                   onClick={() => {
                     navigate("/feedback");
                   }}
                   className="group border-2 border-[#429818] text-[#429818] w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-3 md:py-4 rounded-2xl font-semibold text-sm sm:text-base md:text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 sm:gap-3"
                 >
                   <span>Share Feedback</span>
                   <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                   </svg>
                 </button>
               </div>
                                
        
                        </motion.div>
                    </div>
                </section>
            </PageTransition>
            <Footer />
        </div>
    );
};

export default AboutUs;
