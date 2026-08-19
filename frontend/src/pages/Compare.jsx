import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { compareListings, fetchListings } from "../services/api";

function Compare() {
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings()
      .then((data) => {
        setProperties(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected.length < 2) {
      setComparison(null);
      return;
    }

    compareListings(selected)
      .then((data) => {
        setComparison(data);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, [selected]);

  const toggleProperty = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const selectedProperties = comparison?.properties?.length
    ? comparison.properties
    : properties.filter((property) => selected.includes(property.id));

  return (
    <div className="compare-page">
      <section className="compare-header">
        <div className="compare-header-content">
          <div className="section-label">PROPERTY COMPARISON</div>
          <h1>
            Compare properties.
            <span> Choose smarter.</span>
          </h1>
          <p>
            Select up to three properties and compare their
            listed rent against the AI fair-rent estimate.
          </p>
        </div>
      </section>

      <section className="compare-section">
        <div className="compare-container">
          <div className="selection-header">
            <div>
              <h2>Available Properties</h2>
              <p>Select up to 3 properties from the live dataset</p>
            </div>
            <div className="selection-count">{selected.length}/3 selected</div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}
          {loading ? <p>Loading listings...</p> : null}

          <div className="property-selection-grid">
            {properties.map((property) => {
              const isSelected = selected.includes(property.id);

              return (
                <div
                  key={property.id}
                  className={`compare-property-card ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  <div className="property-placeholder">
                    <span>Property</span>
                  </div>

                  <div className="compare-property-info">
                    <div className="property-card-top">
                      <div>
                        <h3>{property.name}</h3>
                        <p>📍 {property.location}</p>
                      </div>

                      <div className="compare-price">
                        ₹{property.rent.toLocaleString("en-IN")}
                        <small>/month</small>
                      </div>
                    </div>

                    <div className="property-mini-details">
                      <span>🛏 {property.bhk} BHK</span>
                      <span>📐 {property.area} sq.ft</span>
                      <span>🚗 {property.parking}</span>
                    </div>

                    <button
                      className={`select-property-button ${
                        isSelected ? "selected-button" : ""
                      }`}
                      onClick={() => toggleProperty(property.id)}
                    >
                      {isSelected ? "✓ Selected" : "Select Property"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedProperties.length >= 2 && (
            <div className="comparison-result">
              <div className="comparison-heading">
                <div>
                  <div className="section-label">COMPARISON</div>
                  <h2>Property Comparison</h2>
                </div>

                <button
                  className="clear-button"
                  onClick={() => setSelected([])}
                >
                  Clear Selection
                </button>
              </div>

              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {selectedProperties.map((property) => (
                        <th key={property.id}>{property.name}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Monthly Rent</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>
                          <strong>
                            ₹{property.rent.toLocaleString("en-IN")}
                          </strong>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td>AI Fair Rent</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>
                          ₹{property.fair_rent.toLocaleString("en-IN")}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td>BHK</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>{property.bhk} BHK</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Area</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>{property.area} sq.ft</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Bathrooms</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>{property.bathrooms}</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Furnishing</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>{property.furnishing}</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Parking</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>{property.parking}</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Price Status</td>
                      {selectedProperties.map((property) => (
                        <td key={property.id}>
                          <span
                            className={
                              property.status === "Overpriced"
                                ? "status-high"
                                : "status-good"
                            }
                          >
                            {property.status_label}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {comparison?.best ? (
                <div className="best-property">
                  <div className="best-property-icon">★</div>
                  <div>
                    <span>RENTSMART RECOMMENDATION</span>
                    <h3>{comparison.best.name}</h3>
                    <p>{comparison.best.reason}</p>
                  </div>
                  <Link to="/predict" className="best-property-button">
                    Analyze Property →
                  </Link>
                </div>
              ) : null}
            </div>
          )}

          {selectedProperties.length < 2 && (
            <div className="comparison-empty">
              <div className="empty-compare-icon">⚖</div>
              <h3>Select properties to compare</h3>
              <p>
                Choose at least two properties above to
                see a detailed comparison.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Compare;
