import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { recommendListings } from "../services/api";

function Recommendations() {
  const [preferences, setPreferences] = useState({
    location: "Raipur",
    budget: 20000,
    bhk: 2,
    area: 900,
    furnishing: "Furnished",
    parking: "Yes",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("match");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // NORMALIZE VALUES
  // This prevents Furnished / furnished / FURNISHED mismatch
  // ---------------------------------------------------------

  const normalize = (value) => {
    if (value === null || value === undefined) return "";

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ");
  };

  // ---------------------------------------------------------
  // FIND RECOMMENDATIONS
  // ---------------------------------------------------------

  const findMatches = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await recommendListings({
        location: preferences.location,
        budget: Number(preferences.budget),
        bhk: Number(preferences.bhk),
        min_area: Number(preferences.area),
        furnishing: preferences.furnishing,
        parking: preferences.parking,
      });

      // Backend may return:
      // [ ... ]
      // OR
      // { recommendations: [...] }
      // OR
      // { properties: [...] }

      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.recommendations)) {
        data = response.recommendations;
      } else if (Array.isArray(response?.properties)) {
        data = response.properties;
      } else if (Array.isArray(response?.results)) {
        data = response.results;
      }

      // -----------------------------------------------------
      // IMPORTANT:
      // Keep only matching furnishing when the user selects
      // a specific furnishing type.
      // -----------------------------------------------------

      const selectedFurnishing =
        normalize(preferences.furnishing);

      const filteredData = data.filter((property) => {
        const propertyFurnishing = normalize(
          property.furnishing ??
          property.furnishing_type ??
          property.furnished ??
          ""
        );

        // If backend didn't provide furnishing,
        // don't incorrectly reject the property.
        if (!propertyFurnishing) {
          return true;
        }

        if (selectedFurnishing === "furnished") {
          return (
            propertyFurnishing === "furnished"
          );
        }

        if (selectedFurnishing === "semi furnished") {
          return (
            propertyFurnishing === "semi furnished"
          );
        }

        if (selectedFurnishing === "unfurnished") {
          return (
            propertyFurnishing === "unfurnished"
          );
        }

        return true;
      });

      setRecommendations(filteredData);

      if (filteredData.length === 0) {
        setError(
          "No properties found matching your selected preferences."
        );
      }
    } catch (err) {
      console.error("Recommendation error:", err);

      setError(
        err?.message ||
          "Unable to load recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SORT
  // ---------------------------------------------------------

  const sortedRecommendations = useMemo(() => {
    const list = [...recommendations];

    const getRent = (property) =>
      Number(
        property.rent ??
        property.monthly_rent ??
        property.price ??
        0
      );

    const getArea = (property) =>
      Number(
        property.area ??
        property.size ??
        property.sqft ??
        property.square_feet ??
        0
      );

    const getMatch = (property) =>
      Number(
        property.match ??
        property.match_score ??
        property.score ??
        0
      );

    switch (sortBy) {
      case "lowest":
        return list.sort(
          (a, b) => getRent(a) - getRent(b)
        );

      case "highest":
        return list.sort(
          (a, b) => getRent(b) - getRent(a)
        );

      case "area":
        return list.sort(
          (a, b) => getArea(b) - getArea(a)
        );

      case "match":
      default:
        return list.sort(
          (a, b) => getMatch(b) - getMatch(a)
        );
    }
  }, [recommendations, sortBy]);

  // ---------------------------------------------------------
  // PROPERTY HELPERS
  // ---------------------------------------------------------

  const getRent = (property) =>
    Number(
      property.rent ??
      property.monthly_rent ??
      property.price ??
      0
    );

  const getArea = (property) =>
    property.area ??
    property.size ??
    property.sqft ??
    property.square_feet ??
    "—";

  const getBhk = (property) =>
    property.bhk ??
    property.bedrooms ??
    property.bedroom ??
    "—";

  const getFurnishing = (property) =>
    property.furnishing ??
    property.furnishing_type ??
    property.furnished ??
    "—";

  const getParking = (property) => {
    const parking =
      property.parking ??
      property.parking_available ??
      property.has_parking;

    if (
      parking === true ||
      normalize(parking) === "yes" ||
      normalize(parking) === "available"
    ) {
      return "Yes";
    }

    if (
      parking === false ||
      normalize(parking) === "no"
    ) {
      return "No";
    }

    return parking || "—";
  };

  const getLocation = (property) =>
    property.locality ||
    property.location ||
    property.city ||
    "Raipur";

  const getName = (property) =>
    property.name ||
    property.title ||
    `${getBhk(property)} BHK Apartment in ${getLocation(
      property
    )}`;

  const getMatch = (property) =>
    Number(
      property.match ??
      property.match_score ??
      property.score ??
      0
    );

  // ---------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------

  const styles = {
    page: {
      minHeight: "calc(100vh - 70px)",
      background: "#f7f9fe",
      padding: "30px 12px 60px",
      boxSizing: "border-box",
      fontFamily:
        "Inter, Arial, Helvetica, sans-serif",
      color: "#172033",
    },

    container: {
      maxWidth: "1230px",
      margin: "0 auto",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "28px",
      flexWrap: "wrap",
    },

    heading: {
      fontSize: "36px",
      fontWeight: "700",
      margin: "0",
      color: "#172033",
    },

    controls: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "16px",
    },

    sortSelect: {
      height: "48px",
      minWidth: "160px",
      border: "1px solid #d7ddec",
      borderRadius: "10px",
      padding: "0 14px",
      background: "#fff",
      color: "#172033",
      fontSize: "15px",
      outline: "none",
      cursor: "pointer",
    },

    formCard: {
      background: "#fff",
      border: "1px solid #e2e6f0",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "28px",
      boxShadow:
        "0 4px 18px rgba(23,32,51,0.05)",
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "18px",
      alignItems: "end",
    },

    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#4f5c73",
    },

    input: {
      width: "100%",
      height: "44px",
      boxSizing: "border-box",
      border: "1px solid #d7ddec",
      borderRadius: "8px",
      padding: "0 12px",
      fontSize: "15px",
      color: "#172033",
      background: "#fff",
      outline: "none",
    },

    select: {
      width: "100%",
      height: "44px",
      boxSizing: "border-box",
      border: "1px solid #d7ddec",
      borderRadius: "8px",
      padding: "0 10px",
      fontSize: "15px",
      color: "#172033",
      background: "#fff",
      outline: "none",
      cursor: "pointer",
    },

    button: {
      height: "44px",
      border: "none",
      borderRadius: "8px",
      padding: "0 20px",
      background: "#3461ff",
      color: "#fff",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
    },

    resultHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },

    resultTitle: {
      margin: "0",
      fontSize: "24px",
      fontWeight: "700",
    },

    card: {
      display: "flex",
      minHeight: "245px",
      background: "#fff",
      border: "1px solid #dfe4ef",
      borderRadius: "18px",
      overflow: "hidden",
      marginBottom: "18px",
      boxShadow:
        "0 3px 12px rgba(23,32,51,0.04)",
    },

    image: {
      width: "22%",
      minWidth: "200px",
      background:
        "linear-gradient(135deg, #dce5f6, #c6d3e9)",
      position: "relative",
    },

    badge: {
      position: "absolute",
      top: "16px",
      left: "16px",
      padding: "7px 11px",
      borderRadius: "6px",
      background: "#3461ff",
      color: "#fff",
      fontSize: "11px",
      fontWeight: "800",
    },

    cardBody: {
      flex: "1",
      padding: "26px 28px",
    },

    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
    },

    propertyTitle: {
      margin: "0 0 7px",
      fontSize: "20px",
      fontWeight: "700",
      color: "#172033",
    },

    location: {
      margin: "0",
      fontSize: "14px",
      color: "#7b8497",
    },

    price: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#172033",
      whiteSpace: "nowrap",
    },

    priceSmall: {
      fontSize: "12px",
      fontWeight: "400",
      color: "#7b8497",
    },

    divider: {
      height: "1px",
      background: "#e5e8f0",
      margin: "22px 0 16px",
    },

    details: {
      display: "flex",
      flexWrap: "wrap",
      gap: "18px",
      fontSize: "13px",
      color: "#687083",
    },

    bottom: {
      marginTop: "22px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
    },

    match: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    matchCircle: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: "#eaf8f1",
      color: "#15945d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: "800",
    },

    matchText: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
    },

    matchStrong: {
      fontSize: "14px",
      color: "#172033",
    },

    matchSmall: {
      fontSize: "12px",
      color: "#7b8497",
    },

    analyze: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "11px 18px",
      borderRadius: "9px",
      background: "#eef2ff",
      color: "#3461ff",
      textDecoration: "none",
      fontWeight: "700",
      fontSize: "14px",
    },

    error: {
      marginTop: "15px",
      padding: "12px 15px",
      background: "#fff1f1",
      border: "1px solid #ffd5d5",
      borderRadius: "8px",
      color: "#c0392b",
      fontSize: "14px",
    },

    empty: {
      background: "#fff",
      border: "1px solid #e2e6f0",
      borderRadius: "16px",
      padding: "50px 20px",
      textAlign: "center",
      color: "#687083",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div style={styles.header}>

          <h1 style={styles.heading}>
            Properties for you
          </h1>

          {recommendations.length > 0 && (
            <div style={styles.controls}>

              <span>
                Sort by
              </span>

              <select
                style={styles.sortSelect}
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="match">
                  Best Match
                </option>

                <option value="lowest">
                  Lowest Rent
                </option>

                <option value="highest">
                  Highest Rent
                </option>

                <option value="area">
                  Largest Area
                </option>
              </select>

              <span>
                {recommendations.length} properties found
              </span>

            </div>
          )}

        </div>


        {/* =================================================
            SEARCH FORM
        ================================================= */}

        <div style={styles.formCard}>

          <form onSubmit={findMatches}>

            <div style={styles.formGrid}>

              {/* LOCATION */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Location
                </label>

                <select
                  style={styles.select}
                  name="location"
                  value={preferences.location}
                  onChange={handleChange}
                >
                  <option value="Raipur">
                    Raipur
                  </option>

                  <option value="Bhilai">
                    Bhilai
                  </option>
                </select>

              </div>


              {/* BUDGET */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Maximum Budget
                </label>

                <input
                  style={styles.input}
                  type="number"
                  name="budget"
                  value={preferences.budget}
                  onChange={handleChange}
                />

              </div>


              {/* BHK */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  BHK
                </label>

                <select
                  style={styles.select}
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

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Minimum Area
                </label>

                <input
                  style={styles.input}
                  type="number"
                  name="area"
                  value={preferences.area}
                  onChange={handleChange}
                />

              </div>


              {/* FURNISHING */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Furnishing
                </label>

                <select
                  style={styles.select}
                  name="furnishing"
                  value={preferences.furnishing}
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


              {/* PARKING */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Parking
                </label>

                <select
                  style={styles.select}
                  name="parking"
                  value={preferences.parking}
                  onChange={handleChange}
                >
                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </select>

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Finding..."
                  : "Find Best Properties →"}
              </button>

            </div>

          </form>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

        </div>


        {/* =================================================
            RESULTS
        ================================================= */}

        {recommendations.length > 0 && (

          <>

            <div style={styles.resultHeader}>

              <h2 style={styles.resultTitle}>
                Best properties for you
              </h2>

            </div>


            {sortedRecommendations.map(
              (property, index) => {

                const rent =
                  getRent(property);

                const area =
                  getArea(property);

                const bhk =
                  getBhk(property);

                const furnishing =
                  getFurnishing(property);

                const parking =
                  getParking(property);

                const location =
                  getLocation(property);

                const name =
                  getName(property);

                const match =
                  getMatch(property);

                return (

                  <div
                    style={styles.card}
                    key={
                      property.id ||
                      property._id ||
                      index
                    }
                  >

                    {/* IMAGE AREA */}

                    <div style={styles.image}>

                      {index === 0 && (
                        <div style={styles.badge}>
                          BEST MATCH
                        </div>
                      )}

                    </div>


                    {/* PROPERTY CONTENT */}

                    <div style={styles.cardBody}>

                      <div style={styles.titleRow}>

                        <div>

                          <h3
                            style={
                              styles.propertyTitle
                            }
                          >
                            {name}
                          </h3>

                          <p
                            style={
                              styles.location
                            }
                          >
                            📍 {location}
                          </p>

                        </div>


                        <div
                          style={styles.price}
                        >
                          ₹
                          {rent.toLocaleString(
                            "en-IN"
                          )}

                          <span
                            style={
                              styles.priceSmall
                            }
                          >
                            /month
                          </span>
                        </div>

                      </div>


                      <div
                        style={styles.divider}
                      />


                      {/* DETAILS */}

                      <div
                        style={styles.details}
                      >

                        <span>
                          🛏 {bhk} BHK
                        </span>

                        <span>
                          📐 {area} sq.ft
                        </span>

                        <span>
                          🛋 {furnishing}
                        </span>

                        <span>
                          🚗 {parking}
                        </span>

                      </div>


                      {/* BOTTOM */}

                      <div
                        style={styles.bottom}
                      >

                        <div
                          style={styles.match}
                        >

                          <div
                            style={
                              styles.matchCircle
                            }
                          >
                            {match}%
                          </div>

                          <div
                            style={
                              styles.matchText
                            }
                          >

                            <strong
                              style={
                                styles.matchStrong
                              }
                            >
                              {match >= 90
                                ? "Excellent Match"
                                : match >= 80
                                ? "Good Match"
                                : "Possible Match"}
                            </strong>

                            <small
                              style={
                                styles.matchSmall
                              }
                            >
                              Based on your preferences
                            </small>

                          </div>

                        </div>


                        {/* =================================================
                            ANALYSIS BUTTON
                        ================================================= */}

                        <Link
                          to="/analysis"
                          state={{
                            property: {
                              ...property,

                              // Standardized values for Analysis.jsx
                              name,
                              rent,
                              area,
                              bhk,
                              furnishing,
                              parking,
                              location,

                              search_preferences:
                                preferences,
                            },
                          }}
                          style={styles.analyze}
                        >
                          Analyze →
                        </Link>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </>
        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          recommendations.length === 0 &&
          !error && (

            <div style={styles.empty}>

              <h3>
                Find your ideal property
              </h3>

              <p>
                Select your preferences above and
                click "Find Best Properties".
              </p>

            </div>

          )}

      </div>
    </div>
  );
}

export default Recommendations;