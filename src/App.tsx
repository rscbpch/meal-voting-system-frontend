import { Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import SignIn from "./pages/auth/SignIn"
import StaffLogin from "./pages/auth/StaffLogin"
import Menu from "./pages/MenuPage"
const App = () => {
    return (
      <div className="bg-[#F6FFE8]">
        <Menu/>
      </div>
      

      

    )
};

export default App;