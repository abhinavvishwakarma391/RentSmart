import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PredictRent from "./pages/PredictRent";
import Compare from "./pages/Compare";
import Recommendations from "./pages/Recommendations";
import MarketAnalysis from "./pages/MarketAnalysis";
import Analysis from "./pages/Analysis";
import About from "./pages/About";
import NotFound from "./pages/NotFound";


function App() {
  return (

    <BrowserRouter>

      <Layout>

        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* PREDICTION */}

          <Route
            path="/predict"
            element={<PredictRent />}
          />


          {/* COMPARE */}

          <Route
            path="/compare"
            element={<Compare />}
          />


          {/* RECOMMENDATIONS */}

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />


          {/* PROPERTY ANALYSIS */}

          <Route
            path="/analysis"
            element={<Analysis />}
          />


          {/* MARKET */}

          <Route
            path="/market"
            element={<MarketAnalysis />}
          />


          {/* ABOUT */}

          <Route
            path="/about"
            element={<About />}
          />


          {/* 404 */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Layout>

    </BrowserRouter>

  );
}

export default App;