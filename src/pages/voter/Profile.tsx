import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { RiUserSettingsLine } from "react-icons/ri";
import PageTransition from "../../components/PageTransition";
import { PiGraduationCap } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    // const [user, setUser] = useState<User | null>(null);
    const { user, loading, error } = useAuth();
    const navigate = useNavigate();


    const getInitials = (name?: string): string => {
        if (!name) return "U"; // fallback if no name

        const parts = name.trim().split(" ");
        let initials = parts[0].charAt(0).toUpperCase();

        if (parts.length > 1) {
            initials += parts[parts.length - 1].charAt(0).toUpperCase();
        }

        return initials;
    };

    // extract year from expectedGraduation
    const getYearFromDate = (date?: string | Date | null): string => {
        if (!date) return "N/A";

        const parsedDate = typeof date === "string" ? new Date(date) : date;
        if (isNaN(parsedDate.getTime())) return "Invalid date";

        return parsedDate.getFullYear().toString();
    };

    if (loading) return <p>Loading...</p>;

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center items-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-700 mb-4">{error}</p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-[#429818] text-white rounded-lg hover:bg-[#3E7B27] transition-colors"
                        >
                            <FiArrowLeft className="mr-2" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <PageTransition>
                {/* Back Button */}
                <div className="px-10 pt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center bg-white px-4 py-4 rounded-lg shadow-md text-[#429818] hover:text-[#3E7B27] hover:shadow-lg transition-all duration-200"
                    >
                        <FiArrowLeft className="h-5 w-5" strokeWidth={3} />
                    </button>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
                    <div className="bg-white rounded-lg shadow-md pb-6">
                        {/*  Profile Header */}
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-18 h-18 rounded-full bg-[#3E7E1F] flex items-center justify-center text-white text-2xl font-bold">
                                        {getInitials(user?.displayName || "U")}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-700">
                                            {user?.displayName}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="px-6 py-2">
                            <div className="space-y-6 animate-fadeInUp transition-all duration-500 ease-in-out transform">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ">
                                        <div className="w-10 h-10 bg-[#F1F9D9] rounded-full flex items-center justify-center">
                                            <FiMail className="text-[#3E7B27] transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                Email Address
                                            </p>
                                            <p className="font-medium text-gray-700 transition-colors duration-200">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ">
                                        <div className="w-10 h-10 bg-[#F1F9D9] rounded-full flex items-center justify-center">
                                            <PiGraduationCap className="text-[#3E7B27] transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                Expected Graduation
                                            </p>
                                            <p className="font-medium text-gray-700 transition-colors duration-200">
                                                {getYearFromDate(
                                                    user?.expectedGraduationDate
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ">
                                        <div className="w-10 h-10 bg-[#F1F9D9] rounded-full flex items-center justify-center">
                                            <RiUserSettingsLine className="text-[#3E7B27] transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                Role
                                            </p>
                                            <p className="font-medium text-gray-700 transition-colors duration-200">
                                                {user?.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg ">
                                        <div className="w-10 h-10 bg-[#F1F9D9] rounded-full flex items-center justify-center">
                                            <GrStatusGood className="text-[#3E7B27] transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                Status
                                            </p>
                                            {user?.isActive ? (
                                                <p className="font-medium text-[#429818] transition-colors duration-200">
                                                    Active
                                                </p>
                                            ) : (
                                                <p className="font-medium text-[#F42828] transition-colors duration-200">
                                                    Inactive
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Additional sections can be added here */}
                                <div className="pt-6 transform transition-all duration-300 ease-in-out">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 transition-colors duration-200">
                                        Account Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/history"
                                            className="block w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-102 hover:shadow-md"
                                        >
                                            <p className="font-medium text-gray-700 transition-colors duration-200">
                                                View Voting History
                                            </p>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                Check you past votes choice and
                                                selected dishes
                                            </p>
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            className="block w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-102 hover:shadow-md"
                                        >
                                            <p className="font-medium text-gray-700 transition-colors duration-200">
                                                My Wishlist
                                            </p>
                                            <p className="text-sm text-gray-500 transition-colors duration-200">
                                                View your one and only favorite
                                                dish
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>
    );
};

export default Profile;
