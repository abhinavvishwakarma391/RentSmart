import { useState } from "react";
import { Link } from "react-router-dom";

const properties = [
  {
    id: 1,
    name: "Modern City Apartment",
    location: "Raipur",
    rent: 14000,
    bhk: 2,
    area: 950,
    furnishing: "Furnished",
    parking: "Yes",
    match: 96,
  },
  {
    id: 2,
    name: "Green Valley Residence",
    location: "Raipur",
    rent: 15000,
    bhk: 2,
    area: 1000,
    furnishing: "Furnished",
    parking: "Yes",
    match: 91,
  },
  {
    id: 3,
    name: "Premium Family Home",
    location: "Bhilai",
    rent: 16500,
    bhk: 2,
    area: 1100,
    furnishing: "Semi-Furnished",
    parking: "Yes",
    match: 84,
  },
  {
    id: 4,
    name: "Compact Urban Home",
    location: "Raipur",
    rent: 12500,
    bhk: 2,
    area: 850,
    furnishing: "Furnished",
    parking: "No",
    match: 79,
  },
];

function Recommendations() {
  const [preferences, setPreferences] = useState({
    location: "Raipur",
    budget: 15000,
    bhk: "2",
    area: 900,
    furnishing: "Furnished",
    parking: "Yes",
  });

  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const findMatches = (e) => {
    e.preventDefault();

    const budget = Number(preferences.budget);
    const area = Number(preferences.area);

    const scored = properties.map((property) => {
      let score = 0;

      if (
        property.location.toLowerCase() ===
        preferences.location.toLowerCase()
      ) {
        score += 30;
      }

      if (property.bhk === Number(preferences.bhk)) {
        score += 25;
      }

      if (property.rent <= budget) {
        score += 20;
      }

      if (property.area >= area) {
        score += 10;
      }

      if (property.furnishing === preferences.furnishing) {
        score += 10;
      }

      if (property.parking === preferences.parking) {
        score += 5;
      }

      return {
        ...property,
        match: Math.min(score, 100),
      };
    });

    scored.sort((a, b) => b.match - a.match);

    setRecommendations(scored);
  };

  return (
    <div className="recommendations-page">

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

            <Link to="/">
              Home
            </Link>

            <Link to="/predict">
              Predict Rent
            </Link>

            <Link to="/compare">
              Compare
            </Link>

            <Link
              to="/recommendations"
              className="active"
            >
              Recommendations
            </Link>

            <Link to="/market">
              Market
            </Link>

          </div>

          <Link
            to="/predict"
            className="nav-button"
          >
            Get Started
          </Link>

        </div>
      </nav>


      {/* HEADER */}

      <section className="recommend-header">

        <div className="recommend-header-content">

          <div className="section-label">
            SMART RECOMMENDATIONS
          </div>

          <h1>
            Find a home that
            <span> fits you.</span>
          </h1>

          <p>
            Tell RentSmart what you're looking for and we'll
            rank properties based on your preferences.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <section className="recommend-section">

        <div className="recommend-container">


          {/* PREFERENCES */}

          <div className="preferences-card">

            <div className="preferences-heading">

              <div>

                <h2>
                  Your Preferences
                </h2>

                <p>
                  Tell us what you're looking for.
                </p>

              </div>

              <div className="ai-badge">
                ✦ AI Matching
              </div>

            </div>


            <form onSubmit={findMatches}>

              <div className="recommend-form-grid">

                {/* LOCATION */}

                <div className="form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={preferences.location}
                    onChange={handleChange}
                    placeholder="e.g. Raipur"
                  />

                </div>


                {/* BUDGET */}

                <div className="form-group">

                  <label>
                    Maximum Budget
                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={preferences.budget}
                    onChange={handleChange}
                  />

                  <small>
                    ₹ / month
                  </small>

                </div>


                {/* BHK */}

                <div className="form-group">

                  <label>
                    BHK
                  </label>

                  <select
                    name="bhk"
                    value={preferences.bhk}
                    onChange={handleChange}
                  >

                    <option value="1">
                      1 BHK
                    </option>

                    <option value="2">
                      2 BHK
                    </option>

                    <option value="3">
                      3 BHK
                    </option>

                    <option value="4">
                      4 BHK
                    </option>

                  </select>

                </div>


                {/* AREA */}

                <div className="form-group">

                  <label>
                    Minimum Area
                  </label>

                  <input
                    type="number"
                    name="area"
                    value={preferences.area}
                    onChange={handleChange}
                  />

                  <small>
                    sq.ft
                  </small>

                </div>


                {/* FURNISHING */}

                <div className="form-group">

                  <label>
                    Furnishing
                  </label>

                  <select
                    name="furnishing"
                    value={preferences.furnishing}
                    onChange={handleChange}
                  >

                    <option>
                      Furnished
                    </option>

                    <option>
                      Semi-Furnished
                    </option>

                    <option>
                      Unfurnished
                    </option>

                  </select>

                </div>


                {/* PARKING */}

                <div className="form-group">

                  <label>
                    Parking
                  </label>

                  <select
                    name="parking"
                    value={preferences.parking}
                    onChange={handleChange}
                  >

                    <option>
                      Yes
                    </option>

                    <option>
                      No
                    </option>

                  </select>

                </div>

              </div>


              <button
                type="submit"
                className="find-match-button"
              >
                Find My Best Matches
                <span>→</span>
              </button>

            </form>

          </div>


          {/* RESULTS */}

          {recommendations.length > 0 && (

            <div className="recommend-results">

              <div className="results-heading">

                <div>

                  <div className="section-label">
                    MATCH RESULTS
                  </div>

                  <h2>
                    Properties for you
                  </h2>

                </div>

                <span>
                  {recommendations.length} properties found
                </span>

              </div>


              <div className="recommend-list">

                {recommendations.map((property, index) => (

                  <div
                    className="recommend-property"
                    key={property.id}
                  >

                    <div className="recommend-image">

                      {index === 0 && (
                        <span className="best-badge">
                          BEST MATCH
                        </span>
                      )}

                    </div>


                    <div className="recommend-info">

                      <div className="recommend-title-row">

                        <div>

                          <h3>
                            {property.name}
                          </h3>

                          <p>
                            📍 {property.location}
                          </p>

                        </div>

                        <div className="recommend-price">

                          ₹{property.rent.toLocaleString("en-IN")}

                          <small>
                            /month
                          </small>

                        </div>

                      </div>


                      <div className="recommend-details">

                        <span>
                          🛏 {property.bhk} BHK
                        </span>

                        <span>
                          📐 {property.area} sq.ft
                        </span>

                        <span>
                          🛋 {property.furnishing}
                        </span>

                        <span>
                          🚗 Parking
                        </span>

                      </div>


                      <div className="recommend-bottom">

                        <div className="match-score">

                          <div className="match-circle">
                            {property.match}%
                          </div>

                          <div>

                            <strong>
                              {property.match >= 90
                                ? "Excellent Match"
                                : property.match >= 80
                                ? "Good Match"
                                : "Possible Match"}
                            </strong>

                            <small>
                              Based on your preferences
                            </small>

                          </div>

                        </div>


                        <Link
                          to="/predict"
                          className="view-property"
                        >
                          Analyze →
                        </Link>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* INITIAL STATE */}

          {recommendations.length === 0 && (

            <div className="recommend-empty">

              <div className="recommend-empty-icon">
                ✦
              </div>

              <h3>
                Tell us what you need
              </h3>

              <p>
                Set your preferences above and we'll find
                the properties that match you best.
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Recommendations;