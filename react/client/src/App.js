import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/sign-up";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
