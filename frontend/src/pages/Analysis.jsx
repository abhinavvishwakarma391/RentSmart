import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { predictRent } from "../services/api";


function formatRent(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}


function Analysis() {

  const location = useLocation();

  const property =
    location.state?.property || null;


  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (!property) {
      setLoading(false);
      return;
    }


    const analyzeProperty = async () => {

      setLoading(true);
      setError("");


      try {

        const result = await predictRent({

          location:
            property.location ||
            `${property.locality}, ${property.city}`,

          city:
            property.city,

          locality:
            property.locality,

          property_type:
            property.property_type ||
            "Apartment",

          bhk:
            Number(property.bhk),

          area_sqft:
            Number(property.area),

          bathrooms:
            Number(property.bathrooms || 2),

          furnishing:
            property.furnishing,

          parking:
            property.parking,

          listed_rent:
            Number(property.rent),

        });


        setAnalysis(result);

      } catch (err) {

        setError(
          err.message ||
          "Unable to analyze this property."
        );

      } finally {

        setLoading(false);

      }

    };


    analyzeProperty();

  }, [property]);


  /* ========================================================
     NO PROPERTY SELECTED
     ======================================================== */

  if (!property) {

    return (

      <div className="predict-page">

        <section className="predict-header">

          <div className="predict-header-content">

            <div className="section-label">
              PROPERTY ANALYSIS
            </div>

            <h1>
              No property selected.
            </h1>

            <p>
              Please select a property from the
              recommendations page to analyze it.
            </p>

            <Link
              to="/recommendations"
              className="primary-button"
              style={{
                display: "inline-flex",
                marginTop: "25px",
              }}
            >
              Back to Recommendations →
            </Link>

          </div>

        </section>

      </div>

    );

  }


  /* ========================================================
     LOADING
     ======================================================== */

  if (loading) {

    return (

      <div className="predict-page">

        <section className="predict-header">

          <div className="predict-header-content">

            <div className="section-label">
              PROPERTY ANALYSIS
            </div>

            <h1>
              Analyzing property...
            </h1>

            <p>
              RentSmart is evaluating this property
              using the trained rental price model.
            </p>

          </div>

        </section>


        <section className="predict-section">

          <div className="section-container">

            <div className="result-card">

              <div className="result-label">
                AI ANALYSIS
              </div>

              <div className="result-price">
                ...
              </div>

              <p>
                Calculating fair rental value...
              </p>

            </div>

          </div>

        </section>

      </div>

    );

  }


  /* ========================================================
     ERROR
     ======================================================== */

  if (error) {

    return (

      <div className="predict-page">

        <section className="predict-header">

          <div className="predict-header-content">

            <div className="section-label">
              PROPERTY ANALYSIS
            </div>

            <h1>
              Analysis failed
            </h1>

            <p>
              {error}
            </p>

            <Link
              to="/recommendations"
              className="primary-button"
              style={{
                display: "inline-flex",
                marginTop: "25px",
              }}
            >
              Back to Recommendations →
            </Link>

          </div>

        </section>

      </div>

    );

  }


  const listedRent =
    Number(property.rent);

  const predictedRent =
    Number(analysis?.predicted_rent || 0);

  const difference =
    Number(
      analysis?.difference ?? 0
    );

  const differencePct =
    Number(
      analysis?.difference_pct ?? 0
    );


  let statusText =
    analysis?.status || "Fair";


  let statusDescription =
    "";


  if (statusText === "Overpriced") {

    statusDescription =
      `This property is ${Math.abs(
        differencePct
      )}% above the predicted fair rental value.`;

  } else if (
    statusText === "Underpriced"
  ) {

    statusDescription =
      `This property is ${Math.abs(
        differencePct
      )}% below the predicted fair rental value.`;

  } else {

    statusDescription =
      "The listed rent is within the expected fair-price range.";

  }


  return (

    <div className="predict-page">


      {/* ====================================================
          HEADER
          ==================================================== */}

      <section className="predict-header">

        <div className="predict-header-content">

          <div className="section-label">
            PROPERTY ANALYSIS
          </div>

          <h1>
            {property.name}
          </h1>

          <p>
            📍 {property.location}
          </p>

        </div>

      </section>


      {/* ====================================================
          ANALYSIS
          ==================================================== */}

      <section className="predict-section">

        <div className="predict-container">


          {/* ==================================================
              PROPERTY DETAILS
              ================================================== */}

          <div className="predict-form-card">

            <div className="form-heading">

              <div className="section-label">
                SELECTED PROPERTY
              </div>

              <h2>
                Property Details
              </h2>

              <p>
                Details of the property being analyzed.
              </p>

            </div>


            <div className="form-group">

              <label>
                Location
              </label>

              <div className="property-card-fair">

                <strong>
                  {property.city}
                </strong>

              </div>

            </div>


            <div className="form-group">

              <label>
                Locality
              </label>

              <div className="property-card-fair">

                <strong>
                  {property.locality}
                </strong>

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  BHK
                </label>

                <div className="property-card-fair">

                  <strong>
                    {property.bhk} BHK
                  </strong>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Area
                </label>

                <div className="property-card-fair">

                  <strong>
                    {property.area} sq.ft
                  </strong>

                </div>

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Furnishing
                </label>

                <div className="property-card-fair">

                  <strong>
                    {property.furnishing}
                  </strong>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Parking
                </label>

                <div className="property-card-fair">

                  <strong>
                    {property.parking}
                  </strong>

                </div>

              </div>

            </div>


            <div className="form-group">

              <label>
                Listed Rent
              </label>

              <div className="property-card-fair">

                <strong>
                  {formatRent(listedRent)}
                  /month
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              AI ANALYSIS RESULT
              ================================================== */}

          <div className="prediction-result">

            <div className="result-card">


              <div className="result-label">
                AI PROPERTY ANALYSIS
              </div>


              {/* PREDICTED RENT */}

              <div className="result-price">

                {formatRent(
                  predictedRent
                )}

                <small>
                  /month
                </small>

              </div>


              <div className="price-status">

                <span>
                  ✓
                </span>

                {statusText}

              </div>


              {/* LISTED VS PREDICTED */}

              <div className="price-range">

                <p>
                  Listed rent
                </p>

                <strong>
                  {formatRent(listedRent)}
                </strong>

              </div>


              <div className="price-range">

                <p>
                  Predicted fair rent
                </p>

                <strong>
                  {formatRent(predictedRent)}
                </strong>

              </div>


              <div className="price-range">

                <p>
                  Expected rental range
                </p>

                <strong>

                  {formatRent(
                    analysis?.min_rent
                  )}

                  {" – "}

                  {formatRent(
                    analysis?.max_rent
                  )}

                </strong>

              </div>


              {/* DIFFERENCE */}

              <div className="result-note">

                <strong>
                  Price Analysis
                </strong>

                <p>

                  {difference > 0
                    ? `${formatRent(
                        Math.abs(difference)
                      )} above the predicted fair rent.`
                    : difference < 0
                    ? `${formatRent(
                        Math.abs(difference)
                      )} below the predicted fair rent.`
                    : "The listed rent matches the predicted fair rent."}

                </p>

              </div>


              {/* EXPLANATION */}

              <div className="result-note">

                <strong>
                  What this means
                </strong>

                <p>
                  {statusDescription}
                  {" "}
                  The analysis considers the property's
                  location, locality, BHK, area, bathrooms,
                  furnishing and parking using the trained
                  RentSmart rental-price model.
                </p>

              </div>


              {/* MATCH SCORE */}

              {property.match !== undefined && (

                <div className="result-note">

                  <strong>
                    Recommendation Match
                  </strong>

                  <p>
                    This property matched
                    {" "}
                    <strong>
                      {property.match}%
                    </strong>
                    {" "}
                    of your selected preferences.
                  </p>

                </div>

              )}


              {/* BACK */}

              <Link
                to="/recommendations"
                className="result-action"
              >
                ← Back to Recommendations
              </Link>


            </div>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Analysis;