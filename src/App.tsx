import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/auth/SignIn";
import StaffLogin from "./pages/auth/StaffLogin";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/staff-login" element={<StaffLogin />}/>
        </Routes>
    );
};

export default App;