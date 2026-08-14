import { useState } from "react";
import { Link } from "react-router-dom";

const properties = [
  {
    id: 1,
    name: "Modern City Apartment",
    location: "Raipur, Chhattisgarh",
    rent: 14000,
    fairRent: 14500,
    bhk: 2,
    area: 950,
    bathrooms: 2,
    furnishing: "Furnished",
    parking: "Yes",
    status: "Good Value",
  },
  {
    id: 2,
    name: "Premium Family Home",
    location: "Bhilai, Chhattisgarh",
    rent: 16500,
    fairRent: 15000,
    bhk: 2,
    area: 1100,
    bathrooms: 2,
    furnishing: "Semi-Furnished",
    parking: "Yes",
    status: "Slightly High",
  },
  {
    id: 3,
    name: "Compact Urban Home",
    location: "Raipur, Chhattisgarh",
    rent: 12500,
    fairRent: 13000,
    bhk: 2,
    area: 850,
    bathrooms: 1,
    furnishing: "Furnished",
    parking: "No",
    status: "Good Value",
  },
];

function Compare() {
  const [selected, setSelected] = useState([]);

  const toggleProperty = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, id]);
      }
    }
  };

  const selectedProperties = properties.filter((property) =>
    selected.includes(property.id)
  );

  return (
    <div className="compare-page">

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

            <Link to="/compare" className="active">
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


      {/* HEADER */}

      <section className="compare-header">

        <div className="compare-header-content">

          <div className="section-label">
            PROPERTY COMPARISON
          </div>

          <h1>
            Compare properties.
            <span> Choose smarter.</span>
          </h1>

          <p>
            Select up to three properties and compare their
            price, features and overall rental value.
          </p>

        </div>

      </section>


      {/* PROPERTY SELECTION */}

      <section className="compare-section">

        <div className="compare-container">

          <div className="selection-header">

            <div>

              <h2>
                Available Properties
              </h2>

              <p>
                Select up to 3 properties
              </p>

            </div>

            <div className="selection-count">
              {selected.length}/3 selected
            </div>

          </div>


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

                    <span>
                      Property
                    </span>

                  </div>


                  <div className="compare-property-info">

                    <div className="property-card-top">

                      <div>

                        <h3>
                          {property.name}
                        </h3>

                        <p>
                          📍 {property.location}
                        </p>

                      </div>

                      <div className="compare-price">

                        ₹{property.rent.toLocaleString("en-IN")}

                        <small>
                          /month
                        </small>

                      </div>

                    </div>


                    <div className="property-mini-details">

                      <span>
                        🛏 {property.bhk} BHK
                      </span>

                      <span>
                        📐 {property.area} sq.ft
                      </span>

                      <span>
                        🚗 {property.parking}
                      </span>

                    </div>


                    <button
                      className={`select-property-button ${
                        isSelected ? "selected-button" : ""
                      }`}
                      onClick={() => toggleProperty(property.id)}
                    >

                      {isSelected
                        ? "✓ Selected"
                        : "Select Property"}

                    </button>

                  </div>

                </div>
              );
            })}

          </div>


          {/* COMPARISON */}

          {selectedProperties.length >= 2 && (

            <div className="comparison-result">

              <div className="comparison-heading">

                <div>

                  <div className="section-label">
                    COMPARISON
                  </div>

                  <h2>
                    Property Comparison
                  </h2>

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

                      <th>
                        Feature
                      </th>

                      {selectedProperties.map((property) => (

                        <th key={property.id}>

                          {property.name}

                        </th>

                      ))}

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td>
                        Monthly Rent
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>

                          <strong>
                            ₹{property.rent.toLocaleString("en-IN")}
                          </strong>

                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        AI Fair Rent
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>

                          ₹{property.fairRent.toLocaleString("en-IN")}

                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        BHK
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>
                          {property.bhk} BHK
                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        Area
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>
                          {property.area} sq.ft
                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        Bathrooms
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>
                          {property.bathrooms}
                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        Furnishing
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>
                          {property.furnishing}
                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        Parking
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>
                          {property.parking}
                        </td>

                      ))}

                    </tr>


                    <tr>

                      <td>
                        Price Status
                      </td>

                      {selectedProperties.map((property) => (

                        <td key={property.id}>

                          <span
                            className={
                              property.status === "Good Value"
                                ? "status-good"
                                : "status-high"
                            }
                          >
                            {property.status}
                          </span>

                        </td>

                      ))}

                    </tr>

                  </tbody>

                </table>

              </div>


              {/* BEST VALUE */}

              <div className="best-property">

                <div className="best-property-icon">
                  ★
                </div>

                <div>

                  <span>
                    RENTSMART RECOMMENDATION
                  </span>

                  <h3>
                    Modern City Apartment
                  </h3>

                  <p>
                    Best overall value based on rental price,
                    property size and estimated fair rent.
                  </p>

                </div>

                <Link
                  to="/predict"
                  className="best-property-button"
                >
                  Analyze Property →
                </Link>

              </div>

            </div>

          )}


          {selectedProperties.length < 2 && (

            <div className="comparison-empty">

              <div className="empty-compare-icon">
                ⚖
              </div>

              <h3>
                Select properties to compare
              </h3>

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