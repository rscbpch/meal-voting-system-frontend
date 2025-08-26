import Homepage from "./pages/Homepage";
import { BrowserRouter } from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Homepage />
        </BrowserRouter>
    );
};

export default App;