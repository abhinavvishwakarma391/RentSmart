import { useState } from "react";
import { predictRent } from "../services/api";

const INITIAL_FORM = {
  location: "",
  locality: "",
  propertyType: "Apartment",
  bhk: "2",
  area: "",
  bathrooms: "2",
  furnishing: "Furnished",
  parking: "Yes",
  listedRent: "",
};

function formatRent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function PredictRent() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const area = Number(formData.area);
    const bhk = Number(formData.bhk);

    if (!formData.location || !formData.locality) {
      setError("Please select a location and locality.");
      return;
    }

    if (!Number.isFinite(area) || area <= 100) {
      setError("Area must be greater than 100 sq.ft.");
      return;
    }

    if (!Number.isFinite(bhk) || bhk < 1) {
      setError("BHK must be at least 1.");
      return;
    }

    setLoading(true);
    setError("");

    const listedRent = Number(formData.listedRent);

    try {
      const prediction = await predictRent({
        location: `${formData.locality}, ${formData.location}`,
        city: formData.location,
        locality: formData.locality,
        property_type: formData.propertyType,
        bhk,
        area_sqft: area,
        bathrooms: Number(formData.bathrooms),
        furnishing: formData.furnishing,
        parking: formData.parking,
        listed_rent: Number.isFinite(listedRent) && listedRent > 0
          ? listedRent
          : null,
      });

      setResult(prediction);
    } catch (err) {
      setResult(null);
      setError(err.message || "Unable to predict rent right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setResult(null);
    setError("");
    setLoading(false);
  };

  const availableLocalities = localities[formData.location] || [];
  const statusClass =
    result?.status === "Overpriced"
      ? "overpriced"
      : result?.status === "Underpriced"
        ? "underpriced"
        : "";

  return (
    <div className="predict-page">
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
            Enter the property details and RentSmart will
            estimate its fair monthly rental price.
          </p>
        </div>
      </section>

      <section className="predict-section">
        <div className="predict-container">
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

              <div className="form-group">
                <label>
                  Property Type
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="Apartment">
                    Apartment
                  </option>
                  <option value="House">
                    House
                  </option>
                  <option value="Villa">
                    Villa
                  </option>
                  <option value="Studio">
                    Studio
                  </option>
                </select>
              </div>

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
                    min="101"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    sq.ft
                  </small>
                </div>
              </div>

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
                    <option value="Furnished">
                      Furnished
                    </option>
                    <option value="Semi-Furnished">
                      Semi-Furnished
                    </option>
                    <option value="Unfurnished">
                      Unfurnished
                    </option>
                  </select>
                </div>
              </div>

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

              <div className="form-group">
                <label>
                  Listed rent (optional)
                </label>

                <input
                  type="number"
                  name="listedRent"
                  placeholder="e.g. 15000"
                  min="1"
                  value={formData.listedRent}
                  onChange={handleChange}
                />

                <small>
                  Used to classify Fair / Overpriced / Underpriced
                </small>
              </div>

              {error && (
                <p className="form-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="predict-button"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict Fair Rent"}
                <span>
                  →
                </span>
              </button>

              <button
                type="button"
                className="result-action"
                onClick={handleReset}
                style={{
                  display: "block",
                  marginTop: "16px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Reset form
              </button>
            </form>
          </div>

          <div className="prediction-result">
            {loading && (
              <div className="result-empty">
                <div className="result-icon">
                  ₹
                </div>
                <h3>
                  Estimating fair rent
                </h3>
                <p>
                  RentSmart is scoring this property
                  with the trained rental model.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="result-card">
                <div className="result-label">
                  FAIR RENT ESTIMATE
                </div>

                <div className="result-price">
                  {formatRent(result.predicted_rent)}
                  <small>
                    /month
                  </small>
                </div>

                <div className={`price-status ${statusClass}`.trim()}>
                  {result.status}
                  {result.listed_rent
                    ? ` · listed ${formatRent(result.listed_rent)}`
                    : " · no listed rent provided"}
                </div>

                <div className="price-range">
                  <p>
                    Expected rental range
                  </p>
                  <strong>
                    {formatRent(result.min_rent)}
                    {" – "}
                    {formatRent(result.max_rent)}
                  </strong>
                </div>

                <div className="price-range">
                  <p>
                    Neighborhood
                  </p>
                  <strong>
                    {result.locality}, {result.city}
                  </strong>
                </div>

                <div className="result-note">
                  <strong>
                    What this means
                  </strong>
                  <p>
                    {result.status === "Overpriced" &&
                      `The listed rent is about ${Math.abs(result.difference_pct || 0)}% above the predicted fair value.`}
                    {result.status === "Underpriced" &&
                      `The listed rent is about ${Math.abs(result.difference_pct || 0)}% below the predicted fair value.`}
                    {result.status === "Fair" &&
                      (result.listed_rent
                        ? "The listed rent is within a fair band of the predicted value."
                        : "This is the model’s estimated fair monthly rent for the inputs you provided.")}
                    {" "}
                    Change any field and predict again, or reset to start over.
                  </p>
                </div>
              </div>
            )}

            {!loading && !result && (
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PredictRent;
