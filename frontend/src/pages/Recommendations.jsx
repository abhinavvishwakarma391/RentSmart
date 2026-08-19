import { useState } from "react";
import { Link } from "react-router-dom";
import { recommendListings } from "../services/api";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPreferences({
      ...preferences,
      [name]: value,
    });
  };

  const findMatches = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const matches = await recommendListings({
        location: preferences.location,
        budget: Number(preferences.budget),
        bhk: Number(preferences.bhk),
        min_area: Number(preferences.area),
        furnishing: preferences.furnishing,
        parking: preferences.parking,
      });
      setRecommendations(matches);
    } catch (err) {
      setRecommendations([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendations-page">
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


              {error ? <p className="form-error">{error}</p> : null}

              <button
                type="submit"
                className="find-match-button"
                disabled={loading}
              >
                {loading ? "Finding matches..." : "Find My Best Matches"}
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
                          🚗 {property.parking}
                        </span>

                        <span>
                          {property.status_label}
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