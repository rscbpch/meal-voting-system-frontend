import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Homepage = () => {
	const navigate = useNavigate();
    
    return (
		<div>
			<Navbar />
            <section className="py-18 bg-[#F7F7F7]">
                <div className="max-w-7xl mx-auto px-16 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <p className="title-font text-[48px] font-extrabold mb-4">Your meal, Your choice</p>
                    <p className="font-semibold text-[#757575] mb-8">Vote daily on your preferred meals and help the canteen prepare exactly what’s in demand; fresher, tastier, and waste-free.</p>
                    <button 
                        onClick={() => navigate('/menu')}
                        className="cursor-pointer px-6 py-2 rounded-[10px] font-semibold bg-[#429818] text-white hover:bg-[#3E7B27] transition-colors"
                    >
                        Vote now
                    </button>
                </div>
            </section>
        </div>
	);
};

export default Homepage;