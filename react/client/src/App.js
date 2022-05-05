import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/sign-up";
import LogIn from "./pages/log-in";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="log-in" element={<LogIn />} />
      </Routes>
    </div>
  );
}

export default App;
