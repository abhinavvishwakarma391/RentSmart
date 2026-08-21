import { useState } from "react";
import { Link } from "react-router-dom";
import { predictRent } from "../services/api";

function PredictRent() {
  const [formData, setFormData] = useState({
    location: "",
    locality: "",
    propertyType: "Apartment",
    bhk: "2",
    area: "",
    bathrooms: "2",
    furnishing: "Furnished",
    parking: "Yes",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * Localities from the actual rental data
   */

  const localities = {
    Raipur: [
      "Avanti Vihar",
      "Civil Lines",
      "Devendra Nagar",
      "Kabir Nagar",
      "Kachna",
      "Katora Talab",
      "Magneto Mall Area",
      "Mowa",
      "Naya Raipur",
      "Pandri",
      "Saddu",
      "Sarona",
      "Shankar Nagar",
      "Telibandha",
      "Vidhan Sabha Road",
    ],

    Bhilai: [
      "Charoda",
      "Civic Centre",
      "Junwani",
      "Kohka",
      "Maitri Nagar",
      "Nehru Nagar",
      "Power House",
      "Risali",
      "Sector 5",
      "Sector 7",
      "Sector 9",
      "Shanti Nagar",
      "Smriti Nagar",
      "Supela",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    /*
     * When the location changes,
     * clear the previously selected locality.
     */

    if (name === "location") {
      setFormData({
        ...formData,
        location: value,
        locality: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    /*
     * Locality is required for prediction.
     */

    if (!formData.location) {
      setError("Please select a location.");
      setLoading(false);
      return;
    }

    if (!formData.locality) {
      setError("Please select a locality.");
      setLoading(false);
      return;
    }

    try {
      const prediction = await predictRent({
        location: formData.location,
        city: formData.location,
        locality: formData.locality,

        property_type: formData.propertyType,

        bhk: Number(formData.bhk),

        area_sqft: Number(formData.area),

        bathrooms: Number(formData.bathrooms),

        furnishing: formData.furnishing,

        parking: formData.parking,
      });

      setResult({
        rent: prediction.predicted_rent,
        min: prediction.min_rent,
        max: prediction.max_rent,
        city: prediction.city,
        locality: prediction.locality,
        status: prediction.status,
      });
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Get localities for selected city
   */

  const availableLocalities =
    localities[formData.location] || [];

  return (
    <div className="predict-page">

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

              <h2>
                Property Details
              </h2>

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

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Location
                  </option>

                  <option value="Raipur">
                    Raipur
                  </option>

                  <option value="Bhilai">
                    Bhilai
                  </option>

                </select>

              </div>


              {/* LOCALITY */}

              <div className="form-group">

                <label>
                  Locality
                </label>

                <select
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  required
                  disabled={!formData.location}
                >

                  <option value="">
                    Select Locality
                  </option>

                  {availableLocalities.map((locality) => (
                    <option
                      key={locality}
                      value={locality}
                    >
                      {locality}
                    </option>
                  ))}

                </select>

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

                  <option>
                    Apartment
                  </option>

                  <option>
                    House
                  </option>

                  <option>
                    Villa
                  </option>

                  <option>
                    Studio
                  </option>

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

                    <option value="5">
                      5+ BHK
                    </option>

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

                  <small>
                    sq.ft
                  </small>

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

                    <option value="1">
                      1
                    </option>

                    <option value="2">
                      2
                    </option>

                    <option value="3">
                      3
                    </option>

                    <option value="4">
                      4+
                    </option>

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
                      checked={
                        formData.parking === "Yes"
                      }
                      onChange={handleChange}
                    />

                    Yes

                  </label>


                  <label className="radio-option">

                    <input
                      type="radio"
                      name="parking"
                      value="No"
                      checked={
                        formData.parking === "No"
                      }
                      onChange={handleChange}
                    />

                    No

                  </label>

                </div>

              </div>


              {/* ERROR */}

              {error ? (
                <p className="form-error">
                  {error}
                </p>
              ) : null}


              {/* BUTTON */}

              <button
                type="submit"
                className="predict-button"
                disabled={loading}
              >

                {loading
                  ? "Predicting..."
                  : "Predict Fair Rent"}

                <span>
                  →
                </span>

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
                    ✓ Locality-based analysis
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

                  ₹
                  {Number(
                    result.rent
                  ).toLocaleString("en-IN")}

                  <small>
                    /month
                  </small>

                </div>


                <div className="price-status">

                  <span>
                    ✓
                  </span>

                  {result.locality},{" "}
                  {result.city} ·{" "}
                  {result.status} estimate

                </div>


                <div className="price-range">

                  <p>
                    Expected rental range
                  </p>

                  <strong>

                    ₹
                    {Number(
                      result.min
                    ).toLocaleString("en-IN")}

                    {" – "}

                    ₹
                    {Number(
                      result.max
                    ).toLocaleString("en-IN")}

                  </strong>

                </div>


                <div className="result-note">

                  <strong>
                    What this means
                  </strong>

                  <p>
                    This estimate comes from the trained rent model
                    using your location, locality, BHK, area,
                    furnishing, and parking.
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