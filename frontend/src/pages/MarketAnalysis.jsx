import { Link } from "react-router-dom";

const localities = [
  {
    name: "Shankar Nagar",
    avgRent: 14500,
    change: "+8.2%",
    trend: "up",
  },
  {
    name: "Telibandha",
    avgRent: 16200,
    change: "+5.7%",
    trend: "up",
  },
  {
    name: "Katora Talab",
    avgRent: 12800,
    change: "-2.1%",
    trend: "down",
  },
  {
    name: "Avanti Vihar",
    avgRent: 13800,
    change: "+3.4%",
    trend: "up",
  },
];

const bhkData = [
  {
    type: "1 BHK",
    rent: 8500,
    percentage: 35,
  },
  {
    type: "2 BHK",
    rent: 13500,
    percentage: 62,
  },
  {
    type: "3 BHK",
    rent: 18500,
    percentage: 82,
  },
  {
    type: "4 BHK",
    rent: 24500,
    percentage: 100,
  },
];

function MarketAnalysis() {
  return (
    <div className="market-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="nav-container">

          <Link to="/" className="logo">

            <span className="logo-icon">
              ⌂
            </span>

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

            <Link to="/recommendations">
              Recommendations
            </Link>

            <Link
              to="/market"
              className="active"
            >
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

      <section className="market-header">

        <div className="market-header-content">

          <div className="section-label">
            RENTAL MARKET INTELLIGENCE
          </div>

          <h1>
            Understand the
            <span> rental market.</span>
          </h1>

          <p>
            Explore rental prices, locality trends and property
            insights to make better rental decisions.
          </p>

        </div>

      </section>


      {/* DASHBOARD */}

      <section className="market-section">

        <div className="market-container">


          {/* LOCATION SELECTOR */}

          <div className="market-toolbar">

            <div>

              <h2>
                Raipur Rental Market
              </h2>

              <p>
                Current market overview
              </p>

            </div>


            <select className="market-select">

              <option>
                Raipur
              </option>

              <option>
                Bhilai
              </option>

              <option>
                Durg
              </option>

            </select>

          </div>


          {/* STAT CARDS */}

          <div className="market-stats">

            <div className="market-stat-card">

              <div className="stat-icon blue">
                ₹
              </div>

              <div>

                <span>
                  AVERAGE RENT
                </span>

                <strong>
                  ₹14,500
                </strong>

                <small>
                  +6.4% this year
                </small>

              </div>

            </div>


            <div className="market-stat-card">

              <div className="stat-icon purple">
                ≈
              </div>

              <div>

                <span>
                  MEDIAN RENT
                </span>

                <strong>
                  ₹13,800
                </strong>

                <small>
                  +4.8% this year
                </small>

              </div>

            </div>


            <div className="market-stat-card">

              <div className="stat-icon green">
                ↗
              </div>

              <div>

                <span>
                  AVG. PRICE / SQ.FT
                </span>

                <strong>
                  ₹15.20
                </strong>

                <small>
                  +3.2% this year
                </small>

              </div>

            </div>


            <div className="market-stat-card">

              <div className="stat-icon orange">
                ★
              </div>

              <div>

                <span>
                  MOST AFFORDABLE
                </span>

                <strong>
                  Katora Talab
                </strong>

                <small>
                  Avg. ₹12,800/month
                </small>

              </div>

            </div>

          </div>


          {/* CHART ROW */}

          <div className="market-grid">


            {/* RENT BY BHK */}

            <div className="market-card">

              <div className="market-card-header">

                <div>

                  <h3>
                    Average Rent by BHK
                  </h3>

                  <p>
                    Monthly rental prices
                  </p>

                </div>

              </div>


              <div className="bhk-chart">

                {bhkData.map((item) => (

                  <div
                    className="bhk-row"
                    key={item.type}
                  >

                    <div className="bhk-label">
                      {item.type}
                    </div>

                    <div className="bhk-bar-container">

                      <div
                        className="bhk-bar"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      ></div>

                    </div>

                    <div className="bhk-price">
                      ₹{item.rent.toLocaleString("en-IN")}
                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* MARKET TREND */}

            <div className="market-card">

              <div className="market-card-header">

                <div>

                  <h3>
                    Rental Price Trend
                  </h3>

                  <p>
                    Average monthly rent
                  </p>

                </div>

                <span className="trend-positive">
                  +6.4%
                </span>

              </div>


              <div className="trend-chart">

                <div className="chart-y-axis">

                  <span>
                    ₹16K
                  </span>

                  <span>
                    ₹14K
                  </span>

                  <span>
                    ₹12K
                  </span>

                  <span>
                    ₹10K
                  </span>

                  <span>
                    ₹8K
                  </span>

                </div>


                <div className="chart-area">

                  <div className="grid-line line-1"></div>
                  <div className="grid-line line-2"></div>
                  <div className="grid-line line-3"></div>
                  <div className="grid-line line-4"></div>
                  <div className="grid-line line-5"></div>

                  <div className="trend-line">

                    <span className="point p1"></span>
                    <span className="point p2"></span>
                    <span className="point p3"></span>
                    <span className="point p4"></span>
                    <span className="point p5"></span>
                    <span className="point p6"></span>

                  </div>

                  <div className="chart-months">

                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* LOCALITY TABLE */}

          <div className="market-card locality-card">

            <div className="market-card-header">

              <div>

                <h3>
                  Locality Rental Prices
                </h3>

                <p>
                  Compare rental prices across popular areas
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
                      Market Change
                    </th>

                    <th>
                      Market Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {localities.map((locality) => (

                    <tr key={locality.name}>

                      <td>
                        <strong>
                          {locality.name}
                        </strong>
                      </td>

                      <td>
                        ₹{locality.avgRent.toLocaleString("en-IN")}
                        /month
                      </td>

                      <td>

                        <span
                          className={
                            locality.trend === "up"
                              ? "change-up"
                              : "change-down"
                          }
                        >
                          {locality.change}
                        </span>

                      </td>

                      <td>

                        <span className="market-status">
                          {locality.trend === "up"
                            ? "Growing"
                            : "Affordable"}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>


          {/* INSIGHT */}

          <div className="market-insight">

            <div className="insight-icon">
              ✦
            </div>

            <div>

              <span>
                RENTSMART MARKET INSIGHT
              </span>

              <h3>
                2 BHK properties currently offer the
                best balance of price and space.
              </h3>

              <p>
                Based on current rental data, 2 BHK homes
                provide significantly more usable space than
                1 BHK properties without the sharp price
                increase seen with 3 BHK homes.
              </p>

            </div>

          </div>


        </div>

      </section>

    </div>
  );
}

export default MarketAnalysis;