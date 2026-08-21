import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { fetchMarket } from "../services/api";

const CITIES = ["Raipur", "Bhilai"];

function formatRent(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatChange(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}% vs city avg`;
}

function MarketAnalysis() {
  const [city, setCity] = useState("Raipur");
  const [market, setMarket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /*
   * =====================================================
   * LOAD MARKET DATA
   * =====================================================
   */

  useEffect(() => {
    setLoading(true);

    fetchMarket(city)
      .then((data) => {
        setMarket(data);
        setError("");
      })
      .catch((err) => {
        setMarket(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [city]);


  /*
   * =====================================================
   * BHK PIE CHART
   * =====================================================
   */

  const bhkChart = useMemo(() => {

    if (!market?.bhk_breakdown?.length) {
      return null;
    }

    return {

      data: [
        {
          type: "pie",

          labels: market.bhk_breakdown.map(
            (item) => `${item.bhk} BHK`
          ),

          values: market.bhk_breakdown.map(
            (item) => item.avg_rent
          ),

          textinfo: "label+percent",

          textposition: "inside",

          hovertemplate:
            "<b>%{label}</b><br>" +
            "Average Rent: ₹%{value:,.0f}" +
            "<extra></extra>",

          hole: 0.35,
        },
      ],

      layout: {

        height: 320,

        margin: {
          l: 20,
          r: 20,
          t: 20,
          b: 30,
        },

        showlegend: true,

        legend: {
          orientation: "h",
          y: -0.05,
        },

        paper_bgcolor: "rgba(0,0,0,0)",

        plot_bgcolor: "rgba(0,0,0,0)",

        font: {
          family: "Inter, system-ui, sans-serif",
        },

      },

      config: {
        responsive: true,
        displayModeBar: false,
      },

    };

  }, [market]);


  /*
   * =====================================================
   * FURNISHING PIE CHART
   * =====================================================
   */

  const furnishingChart = useMemo(() => {

    if (!market?.furnishing_breakdown?.length) {
      return null;
    }

    return {

      data: [
        {
          type: "pie",

          labels: market.furnishing_breakdown.map(
            (item) => item.furnishing
          ),

          values: market.furnishing_breakdown.map(
            (item) => item.avg_rent
          ),

          textinfo: "label+percent",

          textposition: "inside",

          hovertemplate:
            "<b>%{label}</b><br>" +
            "Average Rent: ₹%{value:,.0f}" +
            "<extra></extra>",

          hole: 0.35,
        },
      ],

      layout: {

        height: 320,

        margin: {
          l: 20,
          r: 20,
          t: 20,
          b: 30,
        },

        showlegend: true,

        legend: {
          orientation: "h",
          y: -0.05,
        },

        paper_bgcolor: "rgba(0,0,0,0)",

        plot_bgcolor: "rgba(0,0,0,0)",

        font: {
          family: "Inter, system-ui, sans-serif",
        },

      },

      config: {
        responsive: true,
        displayModeBar: false,
      },

    };

  }, [market]);


  return (

    <div className="market-page">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="market-hero">

        <div className="market-hero-content">

          <div className="section-label">
            RENTAL MARKET INTELLIGENCE
          </div>

          <h1>
            Understand the
            <span> rental market.</span>
          </h1>

          <p>
            Explore rental prices, property trends and
            market insights across Raipur and Bhilai.
          </p>

        </div>

      </section>


      {/* =====================================================
          MARKET SECTION
      ===================================================== */}

      <section className="market-section">

        <div className="market-container">


          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="market-toolbar">

            <div>

              <h2>
                {city} Rental Market
              </h2>

              <p>

                {loading
                  ? "Loading market overview..."
                  : `${
                      market?.summary?.listing_count || 0
                    } listings analyzed`}

              </p>

            </div>


            <select
              className="market-select"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            >

              {CITIES.map((option) => (

                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>

              ))}

            </select>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error ? (

            <p className="form-error">
              {error}
            </p>

          ) : null}


          {market ? (

            <>


              {/* =================================================
                  MARKET STATISTICS
              ================================================= */}

              <div className="market-stats">


                {/* AVERAGE RENT */}

                <div className="market-stat-card">

                  <div className="stat-icon blue">
                    ₹
                  </div>

                  <div>

                    <span>
                      AVERAGE RENT
                    </span>

                    <strong>
                      {formatRent(
                        market.summary.avg_rent
                      )}
                    </strong>

                    <small>
                      {formatChange(
                        market.summary.peer_change_pct
                      )}
                    </small>

                  </div>

                </div>


                {/* MEDIAN RENT */}

                <div className="market-stat-card">

                  <div className="stat-icon purple">
                    ≈
                  </div>

                  <div>

                    <span>
                      MEDIAN RENT
                    </span>

                    <strong>
                      {formatRent(
                        market.summary.median_rent
                      )}
                    </strong>

                    <small>
                      {market.summary.listing_count}
                      {" "}active listings
                    </small>

                  </div>

                </div>


                {/* PRICE PER SQFT */}

                <div className="market-stat-card">

                  <div className="stat-icon green">
                    ↗
                  </div>

                  <div>

                    <span>
                      AVG. PRICE / SQ.FT
                    </span>

                    <strong>
                      ₹
                      {Number(
                        market.summary.avg_price_per_sqft
                      ).toFixed(2)}
                    </strong>

                    <small>
                      Based on listed rents
                    </small>

                  </div>

                </div>


                {/* MOST AFFORDABLE */}

                <div className="market-stat-card">

                  <div className="stat-icon orange">
                    ★
                  </div>

                  <div>

                    <span>
                      MOST AFFORDABLE
                    </span>

                    <strong>
                      {
                        market.summary
                          .most_affordable_locality
                          .name
                      }
                    </strong>

                    <small>
                      Avg.{" "}
                      {formatRent(
                        market.summary
                          .most_affordable_locality
                          .avg_rent
                      )}
                      /month
                    </small>

                  </div>

                </div>

              </div>


              {/* =================================================
                  COMBINED PIE CHART SECTION
              ================================================= */}

              <div className="market-card">

                <div className="market-card-header">

                  <div>

                    <h3>
                      Rental Breakdown
                    </h3>

                    <p>
                      Average rent by BHK and furnishing type
                    </p>

                  </div>

                </div>


                {/* TWO PIE CHARTS */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "30px",
                    alignItems: "center",
                  }}
                >


                  {/* =========================================
                      BHK PIE CHART
                  ========================================= */}

                  <div>

                    <h4
                      style={{
                        textAlign: "center",
                        marginBottom: "0",
                      }}
                    >
                      Average Rent by BHK
                    </h4>

                    {bhkChart ? (

                      <Plot
                        data={bhkChart.data}
                        layout={bhkChart.layout}
                        config={bhkChart.config}
                        style={{
                          width: "100%",
                        }}
                        useResizeHandler
                      />

                    ) : (

                      <p
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No BHK data available.
                      </p>

                    )}

                  </div>


                  {/* =========================================
                      FURNISHING PIE CHART
                  ========================================= */}

                  <div>

                    <h4
                      style={{
                        textAlign: "center",
                        marginBottom: "0",
                      }}
                    >
                      Rent by Furnishing
                    </h4>

                    {furnishingChart ? (

                      <Plot
                        data={furnishingChart.data}
                        layout={furnishingChart.layout}
                        config={furnishingChart.config}
                        style={{
                          width: "100%",
                        }}
                        useResizeHandler
                      />

                    ) : (

                      <p
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No furnishing data available.
                      </p>

                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  LOCALITY OVERVIEW
                  NO GRAPH / NO MAP
              ================================================= */}

              <div className="market-card">

                <div className="market-card-header">

                  <div>

                    <h3>
                      Locality Overview
                    </h3>

                    <p>
                      Rental prices across localities
                      in {city}
                    </p>

                  </div>

                </div>


                <div
                  style={{
                    padding: "20px 0",
                    textAlign: "center",
                  }}
                >

                  <strong>
                    {market.localities?.length || 0}
                  </strong>

                  <p>
                    localities analyzed
                  </p>

                </div>

              </div>


              {/* =================================================
                  LOCALITY TABLE
              ================================================= */}

              <div className="market-card locality-card">

                <div className="market-card-header">

                  <div>

                    <h3>
                      Locality Rental Prices
                    </h3>

                    <p>
                      Compare rental prices across
                      popular areas
                    </p>

                  </div>

                </div>


                <div className="locality-table-wrapper">

                  <table className="locality-table">

                    <thead>

                      <tr>

                        <th>
                          Locality
                        </th>

                        <th>
                          Average Rent
                        </th>

                        <th>
                          Vs City Avg
                        </th>

                        <th>
                          Market Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {market.localities?.map(
                        (locality) => (

                          <tr
                            key={locality.name}
                          >

                            <td>

                              <strong>
                                {locality.name}
                              </strong>

                            </td>


                            <td>

                              {formatRent(
                                locality.avg_rent
                              )}

                              /month

                            </td>


                            <td>

                              <span
                                className={
                                  locality.change_pct >= 0
                                    ? "change-up"
                                    : "change-down"
                                }
                              >

                                {formatChange(
                                  locality.change_pct
                                )}

                              </span>

                            </td>


                            <td>

                              <span className="market-status">

                                {locality.status}

                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* =================================================
                  MARKET INSIGHT
              ================================================= */}

              <div className="market-insight">

                <div className="insight-icon">
                  ✦
                </div>

                <div>

                  <span>
                    RENTSMART MARKET INSIGHT
                  </span>

                  <h3>
                    {market.insight.title}
                  </h3>

                  <p>
                    {market.insight.body}
                  </p>

                </div>

              </div>

            </>

          ) : null}

        </div>

      </section>

    </div>

  );
}

export default MarketAnalysis;