import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PredictRent from "./pages/PredictRent";
import Compare from "./pages/Compare";
import Recommendations from "./pages/Recommendations";
import MarketAnalysis from "./pages/MarketAnalysis";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/predict"
          element={<PredictRent />}
        />

        <Route
  path="/compare"
  element={<Compare />}
/>

        <Route
  path="/recommendations"
  element={<Recommendations />}
/>

        <Route
  path="/market"
  element={<MarketAnalysis />}
/>

        <Route
  path="/about"
  element={<About />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;