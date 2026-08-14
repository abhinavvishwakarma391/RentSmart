import { useState } from "react";
import { Link } from "react-router-dom";

function PredictRent() {
  const [formData, setFormData] = useState({
    location: "",
    propertyType: "Apartment",
    bhk: "2",
    area: "",
    bathrooms: "2",
    furnishing: "Furnished",
    parking: "Yes",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary dummy prediction.
    // Later this will come from our ML model through FastAPI.

    const area = Number(formData.area) || 900;
    const bhk = Number(formData.bhk);

    let estimatedRent = 7000;

    estimatedRent += area * 7;
    estimatedRent += bhk * 1500;

    if (formData.furnishing === "Furnished") {
      estimatedRent += 2500;
    }

    if (formData.parking === "Yes") {
      estimatedRent += 500;
    }

    estimatedRent = Math.round(estimatedRent / 500) * 500;

    setResult({
      rent: estimatedRent,
      min: estimatedRent - 1500,
      max: estimatedRent + 1500,
    });
  };

  return (
    <div className="predict-page">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="nav-container">

          <Link to="/" className="logo">
            <span className="logo-icon">⌂</span>
            <span>
              Rent<span>Smart</span>
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>

            <Link to="/predict" className="active">
              Predict Rent
            </Link>

            <Link to="/compare">
              Compare
            </Link>

            <Link to="/recommendations">
              Recommendations
            </Link>

            <Link to="/market">
              Market
            </Link>
          </div>

          <Link to="/predict" className="nav-button">
            Get Started
          </Link>

        </div>
      </nav>


      {/* PAGE HEADER */}

      <section className="predict-header">

        <div className="predict-header-content">

          <div className="section-label">
            RENTAL PRICE INTELLIGENCE
          </div>

          <h1>
            Know what your
            <span> rent should be.</span>
          </h1>

          <p>
            Enter the property details and RentSmart will estimate
            its fair monthly rental price.
          </p>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="predict-section">

        <div className="predict-container">

          {/* FORM */}

          <div className="predict-form-card">

            <div className="form-heading">

              <h2>Property Details</h2>

              <p>
                Tell us about the property you're evaluating.
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              {/* LOCATION */}

              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Raipur, Chhattisgarh"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PROPERTY TYPE */}

              <div className="form-group">

                <label>
                  Property Type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >

                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Studio</option>

                </select>

              </div>


              {/* BHK + AREA */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    BHK
                  </label>

                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                  >

                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Area
                  </label>

                  <input
                    type="number"
                    name="area"
                    placeholder="e.g. 950"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />

                  <small>sq.ft</small>

                </div>

              </div>


              {/* BATHROOM + FURNISHING */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Bathrooms
                  </label>

                  <select
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  >

                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Furnishing
                  </label>

                  <select
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                  >

                    <option>Furnished</option>
                    <option>Semi-Furnished</option>
                    <option>Unfurnished</option>

                  </select>

                </div>

              </div>


              {/* PARKING */}

              <div className="form-group">

                <label>
                  Parking Available
                </label>

                <div className="option-group">

                  <label className="radio-option">

                    <input
                      type="radio"
                      name="parking"
                      value="Yes"
                      checked={formData.parking === "Yes"}
                      onChange={handleChange}
                    />

                    Yes

                  </label>


                  <label className="radio-option">

                    <input
                      type="radio"
                      name="parking"
                      value="No"
                      checked={formData.parking === "No"}
                      onChange={handleChange}
                    />

                    No

                  </label>

                </div>

              </div>


              <button
                type="submit"
                className="predict-button"
              >
                Predict Fair Rent
                <span>→</span>
              </button>

            </form>

          </div>


          {/* RESULT */}

          <div className="prediction-result">

            {!result ? (

              <div className="result-empty">

                <div className="result-icon">
                  ₹
                </div>

                <h3>
                  Your rental estimate
                </h3>

                <p>
                  Enter the property details to see
                  the estimated fair rental price.
                </p>

                <div className="result-tips">

                  <div>
                    ✓ Location-based analysis
                  </div>

                  <div>
                    ✓ Property feature analysis
                  </div>

                  <div>
                    ✓ Market-based estimation
                  </div>

                </div>

              </div>

            ) : (

              <div className="result-card">

                <div className="result-label">
                  ESTIMATED FAIR RENT
                </div>

                <div className="result-price">
                  ₹{result.rent.toLocaleString("en-IN")}
                  <small>/month</small>
                </div>

                <div className="price-status">
                  <span>✓</span>
                  Fair Price Estimate
                </div>

                <div className="price-range">

                  <p>
                    Expected rental range
                  </p>

                  <strong>
                    ₹{result.min.toLocaleString("en-IN")}
                    {" – "}
                    ₹{result.max.toLocaleString("en-IN")}
                  </strong>

                </div>

                <div className="result-note">

                  <strong>
                    What this means
                  </strong>

                  <p>
                    This is an initial estimate based on the
                    property details you provided. Our trained
                    ML model will provide the actual prediction
                    once the backend is connected.
                  </p>

                </div>

                <Link
                  to="/compare"
                  className="result-action"
                >
                  Compare Properties →
                </Link>

              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default PredictRent;