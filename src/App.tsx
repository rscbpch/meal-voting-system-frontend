import { BrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/auth/SignIn";

const App = () => {
    return (
        <BrowserRouter>
            <Homepage />
            <SignIn />
        </BrowserRouter>
    );
};

export default App;