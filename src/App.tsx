import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./Components/Header";
import Homepage from "./Components/Homepage";
import SecureGuide from "./Components/SecureGuide";
import Checkerpage from "./Components/Checkerpage";
import AboutPage from "./Components/AboutPage";
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/secure-guide" element={<SecureGuide />} />
          <Route path="/checker" element={<Checkerpage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
