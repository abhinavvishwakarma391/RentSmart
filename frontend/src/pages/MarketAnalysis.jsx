import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import MarketMap from "../components/MarketMap";
import { fetchMarket } from "../services/api";

const CITIES = ["Raipur", "Bhilai"];

function formatRent(value) {
  return `₹${value.toLocaleString("en-IN")}`;
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
      .finally(() => setLoading(false));
  }, [city]);

  const bhkChart = useMemo(() => {
    if (!market?.bhk_breakdown?.length) {
      return null;
    }

    return {
      data: [
        {
          type: "bar",
          x: market.bhk_breakdown.map((item) => item.label),
          y: market.bhk_breakdown.map((item) => item.avg_rent),
          marker: { color: "#4c7dff" },
          hovertemplate: "Avg rent: ₹%{y:,}<extra></extra>",
        },
      ],
      layout: {
        margin: { t: 10, r: 10, b: 40, l: 60 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        yaxis: { title: "Average rent (₹)", tickprefix: "₹", separatethousands: true },
        xaxis: { title: "Property type" },
        height: 320,
      },
      config: { displayModeBar: false, responsive: true },
    };
  }, [market]);

  const furnishingChart = useMemo(() => {
    if (!market?.furnishing_breakdown?.length) {
      return null;
    }

    return {
      data: [
        {
          type: "bar",
          x: market.furnishing_breakdown.map((item) => item.furnishing),
          y: market.furnishing_breakdown.map((item) => item.avg_rent),
          marker: { color: ["#7c5cff", "#4c7dff", "#34c38f"] },
          hovertemplate: "Avg rent: ₹%{y:,}<extra></extra>",
        },
      ],
      layout: {
        margin: { t: 10, r: 10, b: 40, l: 60 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        yaxis: { title: "Average rent (₹)", tickprefix: "₹", separatethousands: true },
        xaxis: { title: "Furnishing" },
        height: 320,
      },
      config: { displayModeBar: false, responsive: true },
    };
  }, [market]);

  const cityChart = useMemo(() => {
    if (!market?.city_comparison?.length) {
      return null;
    }

    return {
      data: [
        {
          type: "bar",
          x: market.city_comparison.map((item) => item.city),
          y: market.city_comparison.map((item) => item.avg_rent),
          marker: { color: ["#4c7dff", "#34c38f"] },
          hovertemplate: "Avg rent: ₹%{y:,}<extra></extra>",
        },
      ],
      layout: {
        margin: { t: 10, r: 10, b: 40, l: 60 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        yaxis: { title: "Average rent (₹)", tickprefix: "₹", separatethousands: true },
        xaxis: { title: "City" },
        height: 320,
      },
      config: { displayModeBar: false, responsive: true },
    };
  }, [market]);

  return (
    <div className="market-page">
      <section className="market-header">
        <div className="market-header-content">
          <div className="section-label">RENTAL MARKET INTELLIGENCE</div>
          <h1>
            Understand the
            <span> rental market.</span>
          </h1>
          <p>
            Explore rental prices, locality trends and property
            insights powered by the live Raipur and Bhilai dataset.
          </p>
        </div>
      </section>

      <section className="market-section">
        <div className="market-container">
          <div className="market-toolbar">
            <div>
              <h2>{city} Rental Market</h2>
              <p>
                {loading
                  ? "Loading market overview..."
                  : `${market?.summary?.listing_count || 0} listings analyzed`}
              </p>
            </div>

            <select
              className="market-select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              {CITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          {market ? (
            <>
              <div className="market-stats">
                <div className="market-stat-card">
                  <div className="stat-icon blue">₹</div>
                  <div>
                    <span>AVERAGE RENT</span>
                    <strong>{formatRent(market.summary.avg_rent)}</strong>
                    <small>{formatChange(market.summary.peer_change_pct)}</small>
                  </div>
                </div>

                <div className="market-stat-card">
                  <div className="stat-icon purple">≈</div>
                  <div>
                    <span>MEDIAN RENT</span>
                    <strong>{formatRent(market.summary.median_rent)}</strong>
                    <small>{market.summary.listing_count} active listings</small>
                  </div>
                </div>

                <div className="market-stat-card">
                  <div className="stat-icon green">↗</div>
                  <div>
                    <span>AVG. PRICE / SQ.FT</span>
                    <strong>₹{market.summary.avg_price_per_sqft.toFixed(2)}</strong>
                    <small>Based on listed rents</small>
                  </div>
                </div>

                <div className="market-stat-card">
                  <div className="stat-icon orange">★</div>
                  <div>
                    <span>MOST AFFORDABLE</span>
                    <strong>{market.summary.most_affordable_locality.name}</strong>
                    <small>
                      Avg. {formatRent(market.summary.most_affordable_locality.avg_rent)}/month
                    </small>
                  </div>
                </div>
              </div>

              <div className="market-grid">
                <div className="market-card">
                  <div className="market-card-header">
                    <div>
                      <h3>Average Rent by BHK</h3>
                      <p>Monthly rental prices in {city}</p>
                    </div>
                  </div>
                  {bhkChart ? (
                    <Plot
                      data={bhkChart.data}
                      layout={bhkChart.layout}
                      config={bhkChart.config}
                      style={{ width: "100%" }}
                      useResizeHandler
                    />
                  ) : null}
                </div>

                <div className="market-card">
                  <div className="market-card-header">
                    <div>
                      <h3>Rent by Furnishing</h3>
                      <p>How furnishing affects monthly rent</p>
                    </div>
                  </div>
                  {furnishingChart ? (
                    <Plot
                      data={furnishingChart.data}
                      layout={furnishingChart.layout}
                      config={furnishingChart.config}
                      style={{ width: "100%" }}
                      useResizeHandler
                    />
                  ) : null}
                </div>
              </div>

              <div className="market-grid">
                <div className="market-card">
                  <div className="market-card-header">
                    <div>
                      <h3>Raipur vs Bhilai</h3>
                      <p>City-level average rent comparison</p>
                    </div>
                  </div>
                  {cityChart ? (
                    <Plot
                      data={cityChart.data}
                      layout={cityChart.layout}
                      config={cityChart.config}
                      style={{ width: "100%" }}
                      useResizeHandler
                    />
                  ) : null}
                </div>

                <div className="market-card map-card">
                  <div className="market-card-header">
                    <div>
                      <h3>Locality Rent Map</h3>
                      <p>OpenStreetMap view of average rents by area</p>
                    </div>
                  </div>
                  <MarketMap city={city} points={market.map_points} />
                </div>
              </div>

              <div className="market-card locality-card">
                <div className="market-card-header">
                  <div>
                    <h3>Locality Rental Prices</h3>
                    <p>Compare rental prices across popular areas</p>
                  </div>
                </div>

                <div className="locality-table-wrapper">
                  <table className="locality-table">
                    <thead>
                      <tr>
                        <th>Locality</th>
                        <th>Average Rent</th>
                        <th>Vs City Avg</th>
                        <th>Market Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {market.localities.map((locality) => (
                        <tr key={locality.name}>
                          <td>
                            <strong>{locality.name}</strong>
                          </td>
                          <td>
                            {formatRent(locality.avg_rent)}/month
                          </td>
                          <td>
                            <span
                              className={
                                locality.change_pct >= 0 ? "change-up" : "change-down"
                              }
                            >
                              {formatChange(locality.change_pct)}
                            </span>
                          </td>
                          <td>
                            <span className="market-status">{locality.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="market-insight">
                <div className="insight-icon">✦</div>
                <div>
                  <span>RENTSMART MARKET INSIGHT</span>
                  <h3>{market.insight.title}</h3>
                  <p>{market.insight.body}</p>
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
