import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* We'll add these pages next */}
        <Route path="/predict" element={<div>Predict Rent</div>} />
        <Route path="/compare" element={<div>Compare Properties</div>} />
        <Route
          path="/recommendations"
          element={<div>Recommendations</div>}
        />
        <Route
          path="/market"
          element={<div>Market Analysis</div>}
        />
        <Route path="/about" element={<div>About RentSmart</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;